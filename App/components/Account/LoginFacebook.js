import React, { useState } from "react";
import { SocialIcon } from "react-native-elements";

// Firebase Functions
import { firebaseFacebookLogIn } from "../../utils/FireBase";

// Component
import Loading from "../Loading";

export default function LoginFacebook(props) {
  const [isLoading, setIsLoading] = useState(false);
  
  const { toastRef, navigate } = props;

  return (
    <>
      <SocialIcon
        title="Iniciar sesión con Facebook"
        button
        type="facebook"
        onPress={() => firebaseFacebookLogIn(navigate, toastRef, setIsLoading)}
      />
      <Loading isVisible={isLoading} text="Iniciando sesión" />
    </>
  );
}
