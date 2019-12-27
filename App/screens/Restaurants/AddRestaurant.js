import React, { useState, useRef } from "react";
import { View, Text } from "react-native";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";

// Component
import AddRestaurantForm from "../../components/Restaurants/AddRestaurantForm";

export default function AddRestaurant(props) {
  const [isLoading, setIsLoading] = useState(false);

  const toastRef = useRef();

  const { navigation } = props;
  const { setIsReloadRestaurants } = navigation.state.params;
  
  return (
    <View>
      <AddRestaurantForm
        toastRef={toastRef}
        setIsLoading={setIsLoading}
        navigation={navigation}
        setIsReloadRestaurants={setIsReloadRestaurants}
      />

      <Toast ref={toastRef} position="center" opacity={0.5} />
      <Loading isVisible={isLoading} text="Creando Restaurante" />
    </View>
  );
}
