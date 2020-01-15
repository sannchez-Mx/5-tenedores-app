import React, { useRef, useEffect, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-easy-toast";

//Firebase functions
import { firestoreDB } from "../utils/FireBase";

//Component
import ListTopRestaurants from "../components/Ranking/ListTopRestaurants";

export default function TopRestaurants(props) {
  const { navigation } = props;
  const [restaurants, setRestaurants] = useState([]);

  const toastRef = useRef();

  useEffect(() => {
    (async () => {
      firestoreDB
        .collection("restaurants")
        .orderBy("rating", "desc")
        .limit(5)
        .get()
        .then(response => {
          const restaurantsArray = [];
          response.forEach(doc => {
            let restaurant = doc.data();
            restaurant.id = doc.id;
            restaurantsArray.push(restaurant);
          });
          setRestaurants(restaurantsArray);
        })
        .catch(() => {
          toastRef.current.show(
            "Error al cargar el Ranking, intentelo más tarde",
            3000
          );
        });
    })();
  }, []);

  return (
    <View>
      <ListTopRestaurants restaurants={restaurants} navigation={navigation} />
      <Toast ref={toastRef} position="center" opacity={0.7} />
    </View>
  );
}
