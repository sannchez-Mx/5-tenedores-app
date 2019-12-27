import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Avatar } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

//Firebase Function
import {
  firebaseUploadAvatar,
  firebaseUpdatePhotoUrl
} from "../../utils/FireBase";

export default function InfoUser(props) {
  const {
    userInfo: { uid, displayName, email, photoURL, providerId },
    setReloadData,
    toastRef,
    setIsLoading,
    setTextLoading
  } = props;

  const changeAvatar = async () => {
    const resultPermision = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const resultPermisionCamera = resultPermision.permissions.cameraRoll.status;

    if (resultPermisionCamera === "denied") {
      toastRef.current.show("Es necesario aceptar los permisos de la; galeria");
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3]
      });

      if (result.cancelled) {
        toastRef.current.show(
          "Has cerrado la galeria sin seleccionar ninguna imagen"
        );
      } else {
        uploadImage(result.uri, uid).then(() => {
          toastRef.current.show("Imagen subida correctamente");
          firebaseUpdatePhotoUrl(uid, toastRef, setReloadData, setIsLoading);
        });
      }
    }
  };

  const uploadImage = async (uri, uid) => {
    setTextLoading("Actualizando Avatar");
    setIsLoading(true);
    const res = await fetch(uri);
    const blob = await res.blob();
    firebaseUploadAvatar(blob, uid).then(() => {
      toastRef.current.show("Avatar actualizado correctamente");
    });
  };

  return (
    <View style={styles.viewUserInfo}>
      <Avatar
        rounded
        size="large"
        showEditButton={
          providerId === "facebook.com" && "google.com" ? false : true
        }
        onEditPress={changeAvatar}
        containerStyle={styles.userInfoAvatar}
        source={{
          uri: photoURL
            ? photoURL
            : "https://api.adorable.io/avatars/266/abott@adorable.png"
        }}
      />
      <View>
        <Text style={styles.displayName}>
          {displayName ? displayName : "Anónimo"}
        </Text>
        <Text>{email ? email : "Social Login"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewUserInfo: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    paddingTop: 30,
    paddingBottom: 30
  },
  userInfoAvatar: {
    marginRight: 20
  },
  displayName: {
    fontWeight: "bold"
  }
});
