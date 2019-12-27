import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

//Facebook Log In
import { FacebookApi } from "./Social";
import * as Facebook from "expo-facebook";

//Google Log In
import { GoogleApi } from "./Social";
import * as Google from "expo-google-app-auth";

//  Environment Variables
import {
  API_KEY,
  APP_ID,
  MESSAGING_SENDER_ID,
  APPLICATION_ID
} from "react-native-dotenv";

// Your web app's Firebase configsuration
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "five-forks-app.firebaseapp.com",
  databaseURL: "https://five-forks-app.firebaseio.com",
  projectId: "five-forks-app",
  storageBucket: "five-forks-app.appspot.com",
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID
};

// Initialize Firebase and Firestore
const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firestoreDB = firebase.firestore(firebaseApp);

//Firebase login status
export const firebaseAuthState = setLogin => {
  firebase.auth().onAuthStateChanged(user => {
    user ? setLogin(true) : setLogin(false);
  });
};

//Firebase register user
export const firebaseCreateUser = async (
  email,
  password,
  toast,
  navigation
) => {
  await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() =>
      toast.current.show("Registro Correcto", 300, () => {
        navigation.navigate("MyAccountScreen");
      })
    )
    .catch(err => toast.current.show("El email ya está en uso", 1500));
};

//Firebase Log In
export const firebaseLogIn = async (email, password, toast, navigation) => {
  await firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(res =>
      toast.current.show("Inicio de sesión correcto", 300, () => {
        navigation.navigate("MyAccountScreen");
      })
    )
    .catch(err => {
      err.code === "auth/wrong-password"
        ? toast.current.show("Contraseña Incorrecta", 1500)
        : err.code === "auth/user-not-found"
        ? toast.current.show("Email Incorrecto", 1500)
        : err;
    });
};

//Firebase Facebook LogIn
export const firebaseFacebookLogIn = async (navigate, toast, setIsLoading) => {
  await Facebook.initializeAsync(APPLICATION_ID);
  const { type, token } = await Facebook.logInWithReadPermissionsAsync(
    FacebookApi.application_id,
    {
      permissions: FacebookApi.permissions
    }
  );

  if (type === "success") {
    setIsLoading(true);
    const credentials = firebase.auth.FacebookAuthProvider.credential(token);
    await firebase
      .auth()
      .signInWithCredential(credentials)
      .then(() => {
        navigate("MyAccountScreen");
      })
      .catch(() => {
        toast.current.show(
          "Error accediendo con Facebook, intentelo más tarde"
        );
      });
  } else if (type === "cancel") {
    toast.current.show("Inicio de sesion cancelado");
  } else {
    toast.current.show("Error desconocido, intentelo más tarde");
  }
  setIsLoading(false);
};

//Firebase Google Log In
export const firebaseGoogleLogIn = async (navigate, toast, setIsLoading) => {
  const { type, idToken } = await Google.logInAsync(GoogleApi);

  if (type === "success") {
    setIsLoading(true);
    const credential = firebase.auth.GoogleAuthProvider.credential(idToken);
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(res => {
        toast.current.show(`Bienvenido ${res.user.displayName}`, 200, () => {
          navigate("MyAccountScreen");
        });
      });
  } else if (type === "cancel") {
    toast.current.show("Inicio de Sesión Cancelado", 400);
  } else {
    toast.current.show("Error Desconocido, Intentelo más Tarde", 400);
  }
  setIsLoading(false);
};

//Firebase User Status
export const firebaseUserStatus = async setUserInfo => {
  const user = firebase.auth().currentUser;
  await setUserInfo(user.providerData[0]);
};

//Firebase User UID
export const firebaseUserUid = () => {
  return firebase.auth().currentUser.uid;
};

//Firebase LogOut
export const firebaseLogOut = () => {
  firebase.auth().signOut();
};

//Firebase Upload Avatar
export const firebaseUploadAvatar = (blob, uid) => {
  let ref = firebase
    .storage()
    .ref()
    .child(`avatar/${uid}`);
  return ref.put(blob);
};

//Firebase Update User
export const firebaseUpdateUser = async update => {
  await firebase.auth().currentUser.updateProfile(update);
};

// Firebase Update Photo User
export const firebaseUpdatePhotoUrl = (
  uid,
  toastRef,
  setReloadData,
  setIsLoading
) => {
  firebase
    .storage()
    .ref(`avatar/${uid}`)
    .getDownloadURL()
    .then(async result => {
      const update = {
        photoURL: result
      };
      await firebase.auth().currentUser.updateProfile(update);
      setReloadData(true);
      setIsLoading(false);
    })
    .catch(() => {
      toastRef.current.show("Error al recuperar el avatar del servidor");
    });
};

//Firebase Reauthenticate User
export const firebaseReauthenticate = password => {
  const user = firebase.auth().currentUser;
  const credentials = firebase.auth.EmailAuthProvider.credential(
    user.email,
    password
  );
  return user.reauthenticateWithCredential(credentials);
};

//Firebase Update Email
export const firebaseUpdateUserEmail = email => {
  return firebase.auth().currentUser.updateEmail(email);
};

//Firebase Update Password
export const firebaseUpdateUserPassword = password => {
  return firebase.auth().currentUser.updatePassword(password);
};

// Firebase Upload restuarants images
export const uploadImagesStorage = async (imageArray, uuid) => {
  const imagesBlob = [];
  await Promise.all(
    imageArray.map(async image => {
      const response = await fetch(image);
      const blob = await response.blob();
      const ref = firebase
        .storage()
        .ref("restaurant-images")
        .child(uuid());
      await ref.put(blob).then(result => {
        imagesBlob.push(result.metadata.name);
      });
    })
  );
  return imagesBlob;
};

export const firebaseDownloadImages = async (setImageRestaurant, image) => {
 return await firebase
    .storage()
    .ref(`restaurant-images/${image}`)
    .getDownloadURL()
    .then(res => {
      !setImageRestaurant ? "" : setImageRestaurant(res);
      return res;
    });
};
