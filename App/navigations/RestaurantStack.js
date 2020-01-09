//Navegación
import { createStackNavigator } from "react-navigation-stack";

//Screen
import RestaurantsScreen from "../screens/Restaurants/Restaurants";
import AddRestaurantScreen from "../screens/Restaurants/AddRestaurant";
import RestaurantScreen from "../screens/Restaurants/Restaurant";
import AddReviewRestaurantScreen from "../screens/Restaurants/AddReviewRestaurant";

//Stacks de navegación
export const restaurantsScreenStack = createStackNavigator({
  Restaurants: {
    screen: RestaurantsScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Restaurantes"
    })
  },
  AddRestaurant: {
    screen: AddRestaurantScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Nuevo Restaurante"
    })
  },
  Restaurant: {
    screen: RestaurantScreen,
    navigationOptions: ({ navigation }) => {
      const { name } = navigation.state.params.restaurant;
      return {
        title: name
      };
    }
  },
  AddReview: {
    screen: AddReviewRestaurantScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Nuevo comentario"
    })
  }
});
