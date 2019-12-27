import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, ScrollView, Text, Dimensions } from "react-native";
import { Rating, ListItem, Icon } from "react-native-elements";

//Component
import CarouselImages from "../../components/Carousel";
import Map from "../../components/Map";

//Firebase Function
import { firebaseDownloadImages } from "../../utils/FireBase";

const screenWidth = Dimensions.get("window").width;

export default function Restaurant(props) {
  const { navigation } = props;
  const { restaurant } = navigation.state.params.restaurant.item;

  const [imagesRestaurant, setImagesRestaurant] = useState([]);
  const [rating, setRating] = useState(restaurant.rating);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userLogged, setUserLogged] = useState(false);

  const toastRef = useRef();

  useEffect(() => {
    const arrayUrls = [];
    (async () => {
      if (Array.isArray(restaurant.image)) {
        await Promise.all(
          restaurant.image.map(async idImage => {
            await firebaseDownloadImages(null, idImage).then(res =>
              arrayUrls.push(res)
            );
          })
        );
        setImagesRestaurant(arrayUrls);
      } else {
        setImagesRestaurant([restaurant.image]);
      }
    })();
  }, []);

  return (
    <ScrollView style={styles.viewBody}>
      <CarouselImages
        arrayImages={imagesRestaurant}
        width={screenWidth}
        height={250}
      />
      <TitleRestaurant
        name={restaurant.name}
        description={restaurant.description}
        rating={rating}
      />
      <RestaurantInfo
        location={restaurant.location}
        name={restaurant.name}
        address={restaurant.address}
      />
    </ScrollView>
  );
}

function TitleRestaurant(props) {
  const { name, description, rating } = props;

  return (
    <View style={styles.viewRestaurantTitle}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.nameRestaurant}>{name}</Text>
        <Rating
          style={styles.rating}
          imageSize={20}
          readonly
          startingValue={parseFloat(rating)}
        />
      </View>
      <Text style={styles.descriptionRestaurant}>{description}</Text>
    </View>
  );
}

function RestaurantInfo(props) {
  const { location, name, address } = props;

  const listInfo = [
    {
      text: address,
      iconName: "map-marker",
      iconType: "material-community",
      action: null
    },
    {
      text: "111 222 333",
      iconName: "phone",
      iconType: "material-community",
      action: null
    },
    {
      text: "noreply@gmail.com",
      iconName: "at",
      iconType: "material-community",
      action: null
    }
  ];

  return (
    <View style={styles.viewRestaurantInfo}>
      <Text style={styles.restaurantInfoTitle}>
        Información sobre el restaurante
      </Text>
      {!location ? null : <Map location={location} name={name} height={100} />}
      {listInfo.map((item, index) => (
        <ListItem
          key={index}
          title={item.text}
          leftIcon={{
            name: item.iconName,
            type: item.iconType,
            color: "#00a680"
          }}
          containerStyle={styles.containerListItem}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  },
  viewFavorite: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 100,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 5
  },
  viewRestaurantTitle: {
    margin: 15
  },
  nameRestaurant: {
    fontSize: 20,
    fontWeight: "bold"
  },
  rating: {
    position: "absolute",
    right: 0
  },
  descriptionRestaurant: {
    marginTop: 5,
    color: "grey"
  },
  viewRestaurantInfo: {
    margin: 15,
    marginTop: 25
  },
  restaurantInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  containerListItem: {
    borderBottomColor: "#d8d8d8",
    borderBottomWidth: 1
  }
});
