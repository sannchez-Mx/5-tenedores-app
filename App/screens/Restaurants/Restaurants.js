import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

// Components
import ListRestaurant from "../../components/Restaurants/ListRestaurants";
import ActionButton from "react-native-action-button";

//Firebase function
import { firebaseAuthState, firestoreDB } from "../../utils/FireBase";

export default function RestaurantsScreen(props) {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [startRestaurants, setStartRestaurants] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const [isReloadRestaurants, setIsReloadRestaurants] = useState(false);
  const limitRestaurants = 12;

  const { navigation } = props;

  useEffect(() => {
    firebaseAuthState(setUser);
  }, []);

  useEffect(() => {
    firestoreDB
      .collection("restaurants")
      .get()
      .then(snap => {
        setTotalRestaurants(snap.size);
      });
    (async () => {
      const resultRestaurants = [];

      const restaurants = firestoreDB
        .collection("restaurants")
        .orderBy("createAt", "desc")
        .limit(limitRestaurants);

      await restaurants.get().then(response => {
        setStartRestaurants(response.docs[response.docs.length - 1]);

        response.forEach(doc => {
          let restaurant = doc.data();
          restaurant.id = doc.id;
          resultRestaurants.push({ restaurant });
        });
        setRestaurants(resultRestaurants);
      });
    })();
    setIsReloadRestaurants(false);
  }, [isReloadRestaurants]);

  const handleLoadMore = async () => {
    const resultRestaurants = [];
    restaurants.length < totalRestaurants && setIsLoading(true);

    const restaurantsDb = firestoreDB
      .collection("restaurants")
      .orderBy("createAt", "desc")
      .startAfter(startRestaurants.data().createAt)
      .limit(limitRestaurants);

    await restaurantsDb.get().then(response => {
      if (response.docs.length > 0) {
        setStartRestaurants(response.docs[response.docs.length - 1]);
      } else {
        setIsLoading(false);
      }

      response.forEach(doc => {
        let restaurant = doc.data();
        restaurant.id = doc.id;
        resultRestaurants.push({ restaurant });
      });

      setRestaurants([...restaurants, ...resultRestaurants]);
    });
  };

  return (
    <View style={styles.viewBody}>
      <ListRestaurant
        restaurants={restaurants}
        isLoading={isLoading}
        handleLoadMore={handleLoadMore}
        navigation={navigation}
      />
      {user && (
        <AddRestaurantButton
          props={props}
          setIsReloadRestaurants={setIsReloadRestaurants}
        />
      )}
    </View>
  );
}

function AddRestaurantButton(props) {
  const {
    navigation: { navigate }
  } = props.props;

  const { setIsReloadRestaurants } = props;

  return (
    <ActionButton
      buttonColor="#00a680"
      onPress={() => navigate("AddRestaurant", { setIsReloadRestaurants })}
    />
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  }
});
