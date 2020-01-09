import React, { useState, useRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import { AirbnbRating, Button, Input } from "react-native-elements";
import Toast from "react-native-easy-toast";

//Component
import Loading from "../../components/Loading";

//Firebase function
import { firebaseUserStatus, firestoreDB } from "../../utils/FireBase";

export default function AddReviewRestaurant(props) {
  const { navigation } = props;
  const { idRestaurant, setReviewsReload } = navigation.state.params;

  const [rating, setRating] = useState(null);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toastRef = useRef();

  const addReview = async () => {
    if (rating === null) {
      toastRef.current.show("No has dado ninguna puntuación");
    } else if (!title) {
      toastRef.current.show("El titulo es obligatorio");
    } else if (!review) {
      toastRef.current.show("El comentario es obligatorio");
    } else {
      setIsLoading(true);
      const user = await firebaseUserStatus();
      const payload = {
        id_user: user.uid,
        image_user: user.photoURL,
        id_restaurant: idRestaurant,
        title: title,
        review: review,
        rating: rating,
        createAt: new Date()
      };

      firestoreDB
        .collection("reviews")
        .add(payload)
        .then(() => {
          updateRestaurant();
        })
        .catch(() => {
          toastRef.current.show(
            "Error al enviar la review, intentelo más tarde"
          );
          setIsLoading(false);
        });
    }
  };

  const updateRestaurant = () => {
    const restaurantRef = firestoreDB
      .collection("restaurants")
      .doc(idRestaurant);

    restaurantRef.get().then(response => {
      const restaurantData = response.data();
      const rating_Total = restaurantData.rating_Total + rating;
      const quantity_Voting = restaurantData.quantity_Voting + 1;
      const ratingResult = rating_Total / quantity_Voting;

      restaurantRef
        .update({ rating: ratingResult, rating_Total, quantity_Voting })
        .then(() => {
          setIsLoading(false);
          setReviewsReload(true);
          navigation.goBack();
        });
    });
  };

  return (
    <View style={styles.viewBody}>
      <View style={styles.viewRating}>
        <AirbnbRating
          count={5}
          reviews={["Pésimo", "Deficiente", "Normal", "Muy Bueno", "Excelente"]}
          defaultRating={0}
          size={35}
          onFinishRating={value => setRating(value)}
        />
      </View>
      <View style={styles.formReview}>
        <Input
          placeholder="Titulo"
          containerStyle={styles.input}
          onChange={e => setTitle(e.nativeEvent.text)}
        />
        <Input
          placeholder="Comentario..."
          multiline={true}
          inputContainerStyle={styles.textArea}
          onChange={e => setReview(e.nativeEvent.text)}
        />
        <Button
          title="Enviar Comentario"
          onPress={addReview}
          containerStyle={styles.btnContainer}
          buttonStyle={styles.btn}
        />
      </View>
      <Toast ref={toastRef} position="center" opacity={0.5} />
      <Loading isVisible={isLoading} text="Enviando comentario" />
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  },
  viewRating: {
    height: 110,
    backgroundColor: "#f2f2f2"
  },
  formReview: {
    flex: 1,
    alignItems: "center",
    margin: 10,
    marginTop: 40
  },
  input: {
    marginBottom: 10
  },
  textArea: {
    height: 150,
    width: "100%",
    padding: 0,
    margin: 0
  },
  btnContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 10,
    width: "95%"
  },
  btn: {
    backgroundColor: "#00a680"
  }
});
