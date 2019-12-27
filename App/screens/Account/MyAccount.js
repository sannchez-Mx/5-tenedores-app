import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";

//Component
import Loading from "../../components/Loading";
import UserGuest from "./UserGuest";
import UserLogged from "./UserLogged";

// Firebase functions
import { firebaseAuthState } from "../../utils/FireBase";

export default function MyAccountScreen(props) {
  useEffect(() => {
    firebaseAuthState(setLogin)
  }, []);

  const [Login, setLogin] = useState(null);
  
  if (Login === null) {
    return <Loading isVisible={true} text="Cargando..." />;
  }

  return Login ? <UserLogged /> : <UserGuest />;
}
