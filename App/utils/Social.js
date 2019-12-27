import {
  APPLICATION_ID,
  ANDRIOD_CLIENT_ID,
  IOS_CLIENT_ID
} from "react-native-dotenv";

export const FacebookApi = {
  application_id: APPLICATION_ID,
  permissions: ["public_profile"]
};

export const GoogleApi = {
  androidClientId: ANDRIOD_CLIENT_ID,
  iosClientId: IOS_CLIENT_ID,
  scopes: ["profile", "email"]
};
