import React from "react";
import { Icon } from "react-native-elements";

//Navegación
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";

//Stack de navegación
import { restaurantsScreenStack } from "./RestaurantStack";
import { topListScreenStack } from "./TopListStack";
import { SearchScreenStack } from "./SearchStack";
import { MyAccountScreenStack } from "./AccountStack";

//Root stack
const navigationStacks = createBottomTabNavigator(
  {
    Restaurants: {
      screen: restaurantsScreenStack,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: "Restaurantes",
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name="compass-outline"
            type="material-community"
            size={22}
            color={tintColor}
          />
        )
      })
    },
    TopList: {
      screen: topListScreenStack,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: "Ranking",
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name="star-outline"
            type="material-community"
            size={22}
            color={tintColor}
          />
        )
      })
    },
    Search: {
      screen: SearchScreenStack,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: "Buscar",
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name="magnify"
            type="material-community"
            size={22}
            color={tintColor}
          />
        )
      })
    },
    Account: {
      screen: MyAccountScreenStack,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: "Cuenta",
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name="home-outline"
            type="material-community"
            size={22}
            color={tintColor}
          />
        )
      })
    }
  },

  //Configuraciones adicionales
  {
    initialRouteName: "Restaurants", // <-- Ruta principal
    order: ["Restaurants", "TopList", "Search", "Account"], // <-- Orden para la navegación
    tabBarOptions: {
      inactiveTintColor: "#646464",
      activeTintColor: "#00a680"
    }
  }
);

//Contenedor de Navegación
export default createAppContainer(navigationStacks);
