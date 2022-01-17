import React, { useState, useEffect } from "react";
import { View, ScrollView, KeyboardAvoidingView } from "react-native";
import { Button, ListItem, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";

import socketIOClient from "socket.io-client";

var socket = socketIOClient("http://192.168.1.7:3000");

function ChatScreen(props) {
  const [currentMessage, setCurrentMessage] = useState();
  const [listMessage, setListMessage] = useState([]);

  // from front to back
  var handleSubmit = () => {
    socket.emit("sendMessage", {
      message: currentMessage,
      pseudo: props.pseudoFromStore,
    });
    setCurrentMessage(" ");
  };
  // from back to front
  useEffect(() => {
    socket.on("sendMessageAll", function (dataFromBack) {
      setListMessage([...listMessage, dataFromBack]);
    });
  }, [listMessage]);

  var messageForScreen = listMessage.map((data, i) => {
    let msgReg = data.message.replace(/fuck/i, "\u2022\u2022\u2022\u2022");
    data.message = msgReg;
    data.message = data.message.replace(":)", "\u263A");
    data.message = data.message.replace(":( ", "\u2639");
    data.message = data.message.replace(/:p/g, "\uD83D\uDE1B");
    data.message = data.message.replace(";)", "\uD83D\uDE09");
    return (
      <ListItem key={i}>
        <ListItem.Subtitle>{data.pseudo}</ListItem.Subtitle>
        <ListItem.Title> {data.message} </ListItem.Title>
      </ListItem>
    );
  });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, marginTop: 50 }}>
        {messageForScreen}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Input
          containerStyle={{ marginBottom: 5 }}
          placeholder="Your message"
          onChangeText={(valeur) => setCurrentMessage(valeur)}
          value={currentMessage}
        />
        <Button
          icon={<Icon name="envelope-o" size={20} color="#ffffff" />}
          title="Send"
          buttonStyle={{ backgroundColor: "#eb4d4b" }}
          type="solid"
          onPress={() => handleSubmit()}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

function mapStateToProps(state) {
  return { pseudoFromStore: state.pseudo };
}

export default connect(mapStateToProps, null)(ChatScreen);
