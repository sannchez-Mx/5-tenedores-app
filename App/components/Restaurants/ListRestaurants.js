import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { Image } from "react-native-elements";

//Firebase funtion
import { firebaseDownloadImages } from "../../utils/FireBase";

export default function ListRestaurant(props) {
  const { restaurants, isLoading, handleLoadMore, navigation } = props;
  return (
    <View>
      {restaurants.length > 0 ? (
        <FlatList
          data={restaurants}
          renderItem={restaurant => (
            <Restaurant restaurant={restaurant} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={<FooterList isLoading={isLoading} />}
        />
      ) : (
        <View style={styles.loaderRestaurants}>
          <ActivityIndicator size="large" />
          <Text>Cargando restaurantes...</Text>
        </View>
      )}
    </View>
  );
}

function Restaurant(props) {
  const {
    restaurant,
    navigation: { navigate }
  } = props;
  const { name, address, description, image } = restaurant.item.restaurant;
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

  return (
    <TouchableOpacity
      onPress={() =>
        navigate("Restaurant", { restaurant: restaurant.item.restaurant })
      }
    >
      <View style={styles.viewRestaurant}>
        <View style={styles.viewRestaurantImage}>
          <Image
            source={{ uri: imageRestaurant }}
            resizeMode="cover"
            style={styles.imageRestaurant}
            PlaceholderContent={<ActivityIndicator color="fff" />}
          />
        </View>
        <View>
          <Text style={styles.restaurantName}>{name}</Text>
          <Text style={styles.restaurantAddress}>{address}</Text>
          <Text style={styles.restaurantDescription}>
            {description.substr(0, 60)}...
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function FooterList(props) {
  const { isLoading } = props;

  if (isLoading) {
    return (
      <View style={styles.loadingRestaurants}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <View style={styles.notFoundRestuants}>
        <Text>No quedan restaurantes por cargar</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loadingRestaurants: {
    marginTop: 20,
    alignItems: "center"
  },
  viewRestaurant: {
    flexDirection: "row",
    margin: 10
  },
  viewRestaurantImage: {
    marginRight: 15
  },
  imageRestaurant: {
    width: 80,
    height: 80
  },
  restaurantName: {
    fontWeight: "bold"
  },
  restaurantAddress: {
    paddingTop: 2,
    color: "grey"
  },
  restaurantDescription: {
    paddingTop: 2,
    color: "grey",
    width: 300
  },
  loaderRestaurants: {
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "center"
  },
  notFoundRestuants: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center"
  }
});
