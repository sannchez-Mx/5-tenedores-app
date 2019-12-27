import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "react-native-elements";
import Carousel, { Pagination } from "react-native-snap-carousel";
export default function CarouselImages(props) {
  const { arrayImages, height, width } = props;

  const [active, setActive] = useState(0);

  return (
    <View>
      <Carousel
        autoplay={true}
        autoplayInterval={8000}
        autoplayDelay={1000}
        enableSnap={true}
        data={arrayImages}
        renderItem={({ item, index }) => (
          <View key={index}>
            <Image style={{ width, height }} source={{ uri: item }} />
          </View>
        )}
        onSnapToItem={index => setActive(index)}
        loop
        sliderWidth={width}
        itemWidth={width}
        activeAnimationType="spring"
        layout="stack"
      />
      <Pagination
        dotsLength={arrayImages.length}
        activeDotIndex={active}
        dotStyle={styles.indicator}
        containerStyle={styles.indicatorContainer}
        inactiveDotStyle={styles.inactiveIndicator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  indicator: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: "white"
  },
  indicatorContainer: {
    alignSelf: "center",
    position: "absolute",
    bottom: 0
  },
  inactiveIndicator: {
    backgroundColor: "black"
  }
});
