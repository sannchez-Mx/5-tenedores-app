import React, { useState } from "react";
import { SocialIcon } from "react-native-elements";
import { StyleSheet } from "react-native";

// Firebase Functions
import { firebaseGoogleLogIn } from "../../utils/FireBase";

// Component
import Loading from "../Loading";

export default function LoginGoogle(props) {
  const [isLoading, setIsLoading] = useState(false);

  const { toastRef, navigate } = props;

  return (
    <>
      <SocialIcon
        title="Iniciar Sesión con Google"
        button
        type="google-plus"
        style={styles.googleButton}
        onPress={() => firebaseGoogleLogIn(navigate, toastRef, setIsLoading)}
      />
      <Loading isVisible={isLoading} text="Iniciando sesión" />
    </>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    backgroundColor: "#df4a32"
  }
});
