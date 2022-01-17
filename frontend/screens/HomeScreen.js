import React, { useState, useEffect } from "react";
import { StyleSheet, ImageBackground } from "react-native";

import { Button, Input, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { connect } from "react-redux";

function HomeScreen(props) {
  const [pseudo, setPseudo] = useState("");
  const [isPseudo, setIsPseudo] = useState(false);

  useEffect(() => {
    function getPseudo() {
      AsyncStorage.getItem("pseudo", function (error, data) {
        if (data) {
          console.log(data);
          setPseudo(data);
          setIsPseudo(true);
          props.onSubmitPseudo(data); //pseudo du local storage vers le store
        }
      });
    }
    getPseudo();
  }, []);
  if (isPseudo == true) {
    return (
      <ImageBackground
        source={require("../assets/home.jpg")}
        style={styles.container}
      >
        <Text style={styles.pseudo}>Welcome back {pseudo}</Text>

        <Button
          icon={<Icon name="arrow-right" size={20} color="#eb4d4b" />}
          title="Go to Map"
          type="solid"
          onPress={() => {
            props.navigation.navigate("BottomNavigator", { screen: "Map" });
          }}
        />
      </ImageBackground>
    );
  } else {
    return (
      <ImageBackground
        source={require("../assets/home.jpg")}
        style={styles.container}
      >
        <Input
          containerStyle={{ marginBottom: 25, width: "70%" }}
          inputStyle={{ marginLeft: 10 }}
          placeholder="John"
          leftIcon={<Icon name="user" size={24} color="#eb4d4b" />}
          onChangeText={(val) => setPseudo(val)}
        />

        <Button
          icon={<Icon name="arrow-right" size={20} color="#eb4d4b" />}
          title="Go to Map"
          type="solid"
          onPress={() => {
            props.onSubmitPseudo(pseudo);
            props.navigation.navigate("BottomNavigator", { screen: "Map" });
            AsyncStorage.setItem("pseudo", pseudo);
            setIsPseudo(true);
          }}
        />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pseudo: {
    fontSize: 25,
    marginBottom: 25,
    color: "white",
    fontWeight: "bold",
  },
});

function mapDispatchToProps(dispatch) {
  return {
    onSubmitPseudo: function (pseudo) {
      dispatch({ type: "savePseudo", pseudo: pseudo });
    },
  };
}

export default connect(null, mapDispatchToProps)(HomeScreen);
