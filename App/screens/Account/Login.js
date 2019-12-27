import React, { useRef } from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Divider } from "react-native-elements";
import Toast from "react-native-easy-toast";

//Log In Facebook
import LoginFacebook from "../../components/Account/LoginFacebook";

//Log in Google
import LoginGoogle from "../../components/Account/LoginGoogle";

// Log In Form
import LoginForm from "../../components/Account/LoginForm";

export default function LoginScreen(props) {
  const toastRef = useRef();

  const { navigate } = props.navigation;

  return (
    <ScrollView>
      <Image
        style={styles.logo}
        resizeMode="contain"
        source={require("../../../assets/images/5-tenedores-letras-icono-logo.png")}
      />
      <View style={styles.viewContainer}>
        <LoginForm toastRef={toastRef} />
        <CreateAccount navigate={navigate} />
      </View>
      <Divider style={styles.divider} />
      <View style={styles.viewContainer}>
        <LoginFacebook toastRef={toastRef} navigate={navigate} />
        <LoginGoogle toastRef={toastRef} navigate={navigate} />
      </View>
      <Toast
        ref={toastRef}
        position="bottom"
        positionValue={260}
        opacity={0.5}
      />
    </ScrollView>
  );
}

const CreateAccount = props => {
  const { navigate } = props;

  return (
    <Text style={styles.textRegister}>
      ¿Aún no tienes un cuenta?{" "}
      <Text style={styles.btnRegister} onPress={() => navigate("Register")}>
        Regístrate
      </Text>
    </Text>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: "100%",
    height: 150,
    marginTop: 20
  },
  viewContainer: {
    marginRight: 40,
    marginLeft: 40
  },
  textRegister: {
    marginTop: 15,
    marginLeft: 40,
    marginRight: 40
  },
  btnRegister: {
    color: "#00a680",
    fontWeight: "bold"
  },
  divider: {
    backgroundColor: "#00a680",
    margin: 40
  }
});
