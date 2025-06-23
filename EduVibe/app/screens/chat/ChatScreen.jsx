import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const ChatScreen = () => {
  const [messages, setMessages] = useState([]); // Start with an empty array for messages
  const [inputText, setInputText] = useState("");
  const [keyboardHeight] = useState(new Animated.Value(0));
  const [viewHeight, setViewHeight] = useState(new Animated.Value(0));
  const paddingAboveKeyboard = 0; // Set to 0 for minimal padding

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        Animated.parallel([
          Animated.timing(keyboardHeight, {
            duration: event.duration,
            toValue: event.endCoordinates.height,
            useNativeDriver: false,
          }),
          Animated.timing(viewHeight, {
            duration: event.duration,
            toValue: -event.endCoordinates.height - paddingAboveKeyboard,
            useNativeDriver: false,
          }),
        ]).start();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      (event) => {
        Animated.parallel([
          Animated.timing(keyboardHeight, {
            duration: event.duration,
            toValue: 0,
            useNativeDriver: false,
          }),
          Animated.timing(viewHeight, {
            duration: event.duration,
            toValue: 0,
            useNativeDriver: false,
          }),
        ]).start();
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [keyboardHeight, viewHeight]);

  const renderMessageItem = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "me" ? styles.myMessage : styles.theirMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      {item.time && <Text style={styles.timeText}>{item.time}</Text>}
    </View>
  );

  const handleSend = () => {
    if (inputText.trim().length > 0) {
      const newMessage = {
        id: (messages.length + 1).toString(),
        text: inputText,
        sender: "me",
        time: new Date().toLocaleTimeString(),
      };
      setMessages([newMessage, ...messages]);
      setInputText("");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.avatar}
            source={{ uri: "https://placekitten.com/50/50" }} // Placeholder image for the user avatar
          />
          <View>
            <Text style={styles.userName}>Nick Miller</Text>
            <Text style={styles.lastSeen}>last seen 2m ago</Text>
          </View>
        </View>
        <Animated.View
          style={[
            styles.messageListContainer,
            { marginBottom: keyboardHeight },
          ]}
        >
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessageItem}
            style={styles.messageList}
            contentContainerStyle={{ padding: 10 }}
            inverted
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.inputContainer,
            { transform: [{ translateY: viewHeight }] },
          ]}
        >
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Icon name="send" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 18,
  },
  lastSeen: {
    fontSize: 12,
    color: "#888",
  },
  messageListContainer: {
    flex: 1,
  },
  messageList: {
    flex: 1,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: "70%",
  },
  myMessage: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
  },
  theirMessage: {
    backgroundColor: "#e5e5ea",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#fff",
  },
  timeText: {
    color: "#fff",
    fontSize: 10,
    marginTop: 5,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ChatScreen;
