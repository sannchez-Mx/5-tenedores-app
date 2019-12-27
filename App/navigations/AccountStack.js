//Navegación
import { createStackNavigator } from "react-navigation-stack";

//Screen
import MyAccountScreen from "../screens/Account/MyAccount";
import LoginScreen from "../screens/Account/Login";
import RegisterScreen from "../screens/Account/Register";

//Stacks de navegación
export const MyAccountScreenStack = createStackNavigator({
  MyAccountScreen: {
    screen: MyAccountScreen,
    navigationOptions: ({ navigation }) => ({
      title: "My cuenta"
    })
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Login"
    })
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Registro"
    })
  }
});
