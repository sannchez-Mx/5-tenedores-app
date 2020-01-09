//Navegación
import { createStackNavigator } from "react-navigation-stack";

//Screen
import FavoritesScreen from "../screens/Favorites";

//Stacks de navegación
export const favoriteScreenStack = createStackNavigator({
  Favorites: {
    screen: FavoritesScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Restaurantes Favoritos"
    })
  }
});
