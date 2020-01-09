import React from "react";
import { YellowBox } from "react-native";

YellowBox.ignoreWarnings([
  "Setting a timer",
  "ERR_APP_AUTH",
  "componentWillReceiveProps",
  "VirtualizedLists"
]);

//Navegación
import Navigation from "./App/navigations/Navigation";

export default function App() {
  return <Navigation />;
}