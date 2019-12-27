//Navegación
import { createStackNavigator } from "react-navigation-stack";

//Screen
import SearchScreen from "../screens/Search";

//Stacks de navegación
export const SearchScreenStack = createStackNavigator({
  SearchScreen: {
    screen: SearchScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Busca tu restaurante"
    })
  }
});
