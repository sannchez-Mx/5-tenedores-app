//Navegación
import { createStackNavigator } from "react-navigation-stack";

//Screen
import RestaurantsScreen from "../screens/Restaurants/Restaurants";
import AddRestaurantScreen from "../screens/Restaurants/AddRestaurant";
import RestaurantScreen from "../screens/Restaurants/Restaurant";

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
      const { name } = navigation.state.params.restaurant.item.restaurant;
      return {
        title: name
      };
    }
  }
});
