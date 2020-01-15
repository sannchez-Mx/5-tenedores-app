import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Image, Text } from "react-native";
import { SearchBar, ListItem, Icon } from "react-native-elements";
import { useDebouncedCallback } from "use-debounce";

//Firebase function
import {
  firebaseSearchRestaurant,
  firebaseDownloadImages
} from "../utils/FireBase";

export default function SearchScreen(props) {
  const { navigation } = props;
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    onSearch();
  }, [search]);

  const [onSearch] = useDebouncedCallback(async () => {
    await firebaseSearchRestaurant(search, setRestaurants);
  }, 300);

  return (
    <View>
      <SearchBar
        placeholder="Busca tu restaurante..."
        onChangeText={e => setSearch(e)}
        value={search}
        containerStyle={styles.searchBar}
      />
      {restaurants.length === 0 ? (
        <NoFoundRestaurants />
      ) : (
        <FlatList
          data={restaurants}
          renderItem={restaurant => (
            <Restaurant restaurant={restaurant} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

function Restaurant(props) {
  const { restaurant, navigation } = props;
  const { name, image } = restaurant.item;
  const [imageRestaurant, setImageRestaurant] = useState(
    "https://www.samsung.com/etc/designs/smg/global/imgs/support/cont/NO_IMG_600x600.png"
  );

  useEffect(() => {
    (async () => {
      if (Array.isArray(image)) {
        await firebaseDownloadImages(setImageRestaurant, image[0]);
      } else {
        setImageRestaurant(image);
      }
    })();
  }, []);

  return (
    <ListItem
      title={name}
      leftAvatar={{ source: { uri: imageRestaurant } }}
      rightIcon={<Icon type="material-community" name="chevron-right" />}
      onPress={() =>
        navigation.navigate("Restaurant", { restaurant: restaurant.item })
      }
    />
  );
}

function NoFoundRestaurants() {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Image
        source={require("../../assets/images/no-result-found.png")}
        resizeMode="cover"
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 20
  }
});
