import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from "react-native";
import { Image, Icon, Button } from "react-native-elements";
import Toast from "react-native-easy-toast";
import { NavigationEvents } from "react-navigation";

//Component
import Loading from "../components/Loading";

//Firebase function
import {
  firestoreDB,
  firebaseUserUid,
  firebaseDownloadImages,
  firebaseAuthState
} from "../utils/FireBase";

export default function Favorites(props) {
  const { navigation } = props;

  const [restaurants, setRestaurants] = useState([]);
  const [reloadRestaurants, setReloadRestaurants] = useState(false);
  const [isVisibleLoding, setIsVisibleLoading] = useState(false);
  const [userLogged, setUserLogged] = useState(false);

  const toastRef = useRef();

  firebaseAuthState(setUserLogged);

  useEffect(() => {
    if (userLogged) {
      const id_user = firebaseUserUid();
      firestoreDB
        .collection("favorites")
        .where("id_user", "==", id_user)
        .get()
        .then(response => {
          const idRestaurantsArray = [];
          response.forEach(doc => {
            idRestaurantsArray.push(doc.data().id_restaurant);
          });

          getDataRestaurants(idRestaurantsArray).then(response => {
            const restaurants = [];
            response.forEach(doc => {
              let restaurant = doc.data();
              restaurant.id = doc.id;
              restaurants.push(restaurant);
            });
            setRestaurants(restaurants);
          });
        });
    }
    setReloadRestaurants(false);
  }, [reloadRestaurants]);

  const getDataRestaurants = idRestaurantsArray => {
    const arrayRestaurants = [];
    idRestaurantsArray.forEach(idRestaurant => {
      const result = firestoreDB
        .collection("restaurants")
        .doc(idRestaurant)
        .get();
      arrayRestaurants.push(result);
    });
    return Promise.all(arrayRestaurants);
  };

  if (!userLogged) {
    return (
      <UserNoLogged
        setReloadRestaurants={setReloadRestaurants}
        navigation={navigation}
      />
    );
  }

  if (restaurants.length === 0) {
    return <NotFoundRestaurants setReloadRestaurants={setReloadRestaurants} />;
  }

  return (
    <View style={styles.viewBody}>
      <NavigationEvents onWillFocus={() => setReloadRestaurants(true)} />
      {restaurants ? (
        <FlatList
          data={restaurants}
          renderItem={restaurant => (
            <Restaurant
              restaurant={restaurant}
              navigation={navigation}
              setIsVisibleLoading={setIsVisibleLoading}
              setReloadRestaurants={setReloadRestaurants}
              toastRef={toastRef}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.loaderRestaurants}>
          <ActivityIndicator size="large" />
          <Text>Cargando restaurantes</Text>
        </View>
      )}
      <Toast ref={toastRef} position="center" opacity={1} />
      <Loading text="Eliminando Restaurante" isVisible={isVisibleLoding} />
    </View>
  );
}

function Restaurant(props) {
  const {
    restaurant,
    navigation,
    setIsVisibleLoading,
    setReloadRestaurants,
    toastRef
  } = props;

  const { id, name, image } = restaurant.item;
  const [imageRestaurant, setImageRestaurant] = useState(
    "https://www.samsung.com/etc/designs/smg/global/imgs/support/cont/NO_IMG_600x600.png"
  );

  useEffect(() => {
    if (Array.isArray(image)) {
      firebaseDownloadImages(setImageRestaurant, image[0]);
    } else {
      setImageRestaurant(image);
    }
  }, []);

  const confirmRemoveFavorite = () => {
    Alert.alert(
      "Eliminar Restaurante de Favoritos",
      "¿Estas seguro de que quieres eliminar el restaurante de favoritos?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: removeFavorite
        }
      ],
      { cancelable: false }
    );
  };

  const removeFavorite = () => {
    setIsVisibleLoading(true);
    const id_user = firebaseUserUid();
    firestoreDB
      .collection("favorites")
      .where("id_restaurant", "==", id)
      .where("id_user", "==", id_user)
      .get()
      .then(response => {
        response.forEach(doc => {
          const idFavorite = doc.id;
          firestoreDB
            .collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsVisibleLoading(false);
              setReloadRestaurants(true);
              toastRef.current.show("Restaurante eliminado correctamente");
            })
            .catch(() => {
              toastRef.current.show(
                "Error al eliminar el restaurante, intentelo más tarde"
              );
            });
        });
      });
  };

  return (
    <View style={styles.restaurant}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Restaurant", { restaurant: restaurant.item })
        }
      >
        <Image
          resizeMode="cover"
          source={{ uri: imageRestaurant }}
          style={styles.image}
          PlaceholderContent={<ActivityIndicator color="#fff" />}
        />
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Icon
          type="material-community"
          name="heart"
          color="#00a680"
          containerStyle={styles.favorite}
          onPress={confirmRemoveFavorite}
          size={40}
          underlayColor="transparent"
        />
      </View>
    </View>
  );
}

function NotFoundRestaurants(props) {
  const { setReloadRestaurants } = props;

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <NavigationEvents onWillFocus={() => setReloadRestaurants(true)} />
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        No tienes restaurantes en tu lista
      </Text>
    </View>
  );
}

function UserNoLogged(props) {
  const { setReloadRestaurants, navigation } = props;

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <NavigationEvents onWillFocus={() => setReloadRestaurants(true)} />
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
        Necesitas estar logeado para ver esta sección.
      </Text>
      <Button
        title="Ir al login"
        onPress={() => navigation.navigate("Login")}
        containerStyle={{ marginTop: 20, width: "80%" }}
        buttonStyle={{ backgroundColor: "#00a680" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#f2f2f2"
  },
  loaderRestaurants: {
    marginTop: 10,
    marginBottom: 10
  },
  restaurant: {
    margin: 10
  },
  image: {
    width: "100%",
    height: 180
  },
  info: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: -30,
    backgroundColor: "#fff"
  },
  name: {
    fontWeight: "bold",
    fontSize: 20
  },
  favorite: {
    marginTop: -35,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 100
  }
});
