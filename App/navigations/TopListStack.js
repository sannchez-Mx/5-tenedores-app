//Navegación
import { createStackNavigator } from "react-navigation-stack";

//Screen
import TopRestaurants from "../screens/TopRestaurants";

//Stacks de navegación
export const topListScreenStack = createStackNavigator({
  TopList: {
    screen: TopRestaurants,
    navigationOptions: ({ navigation }) => ({
      title: "Los mejores restaurantes"
    })
  }
});