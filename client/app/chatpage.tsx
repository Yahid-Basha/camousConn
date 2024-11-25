import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Image,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { Entypo, FontAwesome, Ionicons, Octicons } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "./supabase";

const ChatPage = () => {
  const ipAddress = process.env.HOSTNAME;
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();
  const { roomId, roomName } = useLocalSearchParams();
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const { userId } = useAuth();
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [recepientData, setRecepientData] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://10.0.57.115:3000/messages/${userId}/${roomId}`
      );
      const data = await response.json();

      if (response.ok) {
        setMessages(data);
      } else {
        console.log("error showing messags", response.status.message);
      }
    } catch (error) {
      console.log("error fetching messages", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        console.log("fetching user data");
        const response = await fetch(`http://10.0.57.115:3000/user/${userId}`);

        const data = await response.json();
        // console.log("data", data);
        setUser(data);
      } catch (error) {
        console.log("error fetching user data", error);
      }
    };
    fetchCurrentUser();
  }, []);
  //   console.log("messages", messages);

  useEffect(() => {
    const fetchRecepientData = async () => {
      console.log("fetching room data");
      try {
        const response = await fetch(`http://10.0.57.115:3000/room/${roomId}`);

        const data = await response.json();
        setRecepientData(data);
      } catch (error) {
        console.log("error retrieving details", error);
      }
    };

    fetchRecepientData();
  }, []);

  const uploadImageToSupabase = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();
    const fileName = `public/${Date.now()}.jpg`;
    const { error } = await supabase.storage
      .from("files")
      .upload(fileName, arrayBuffer, {
        contentType: "image/jpeg",
        upsert: false,
      });
    if (error) {
      console.error("Error uploading image: ", error);
    } else {
      console.log("Image uploaded successfully");
      return supabase.storage.from("files").getPublicUrl(fileName);
    }
    return null;
  };

  // console.log("recepientData", recepientData);

  const sendMessage = async (messageType: String, imageUrl: any) => {
    try {
      let imageFileUrl = "";
      if (messageType === "image") {
        const result = await uploadImageToSupabase(imageUrl);
        if (result) {
          imageFileUrl = result.data.publicUrl;
        } else {
          console.error("Failed to upload image to Supabase");
          return;
        }
        if (!imageFileUrl) {
          console.error("Failed to upload image to Supabase");
          return;
        } else {
          console.log("Image uploaded successfully:", imageFileUrl);
        }
      }

      const formData = new FormData();
      formData.append("senderId", userId);
      formData.append("roomId", Array.isArray(roomId) ? roomId[0] : roomId);
      formData.append("messageType", messageType);
      if (messageType === "text") {
        formData.append("message", message);
      } else {
        formData.append("imageUrl", imageFileUrl);
      }
      console.log("formData", formData);
      const response = await fetch("http://10.0.57.115:3000/sendMessage", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("");
        setSelectedImage("");
        fetchMessages();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      sendMessage("image", result.assets[0].uri);
    }
    console.log(result.assets[0].uri);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
          {recepientData && (
            <Image
              source={{ uri: recepientData?.imageLink || "no-link" }}
              style={{ width: 40, height: 40, borderRadius: 50 }}
            />
          )}
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            {recepientData?.roomName}
          </Text>
        </View>
      ),
    });
  });

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* <Text>Room ID: {roomId}</Text> */}
      <ScrollView
        style={{
          marginTop: 10,
        }}
      >
        {messages.map((message, index) => {
          const baseUrl = "/Users/yahid/Dev/campusconn/api/files";
          if (message.messageType === "text") {
            return (
              <Pressable
                key={index}
                style={
                  message?.senderId._id === user._id
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "blue",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 10,
                        marginVertical: 2,
                        marginHorizontal: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "#c88686",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 10,
                        marginVertical: 2,
                        marginHorizontal: 10,
                      }
                }
              >
                <Text style={{ color: "white", fontSize: 13 }}>
                  {message.message}
                </Text>
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: 9,
                    color: "white",
                    marginTop: 5,
                  }}
                >
                  {formatTime(message.timestamp)}
                </Text>
              </Pressable>
            );
          } else if (message.messageType === "image") {
            const imageUrl = message.imageUrl;
            console.log("imageUrl", imageUrl);
            const source = { uri: imageUrl || "no-link" };
            return (
              <Pressable
                key={index}
                style={[
                  message?.senderId?._id === user._id
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "blue",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "#d4c0c0",
                        padding: 8,
                        margin: 10,
                        borderRadius: 7,
                        maxWidth: "60%",
                      },
                ]}
              >
                <View>
                  <Image
                    source={source}
                    style={{ width: 200, height: 200, borderRadius: 7 }}
                  />
                  <Text
                    style={{
                      textAlign: "right",
                      fontSize: 9,
                      position: "absolute",
                      right: 10,
                      bottom: 7,
                      color: "white",
                      marginTop: 5,
                    }}
                  >
                    {formatTime(message.timestamp)}
                  </Text>
                </View>
              </Pressable>
            );
          }
          return null;
        })}
      </ScrollView>

      <View style={styles.messageBox}>
        <Octicons
          name="smiley"
          size={24}
          color="black"
          style={{ marginRight: 10 }}
          onPress={handleEmojiPicker}
        />
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={(text) => setMessage(text)}
          placeholder="Type your message"
        />
        <Entypo
          onPress={() => {
            pickImage();
          }}
          name="camera"
          size={24}
          color="gray"
        />
        <FontAwesome
          name="microphone"
          size={24}
          color="gray"
          style={{ marginLeft: 10 }}
        />
        <Pressable
          onPress={() => sendMessage("text")}
          style={{ marginLeft: 10 }}
        >
          <Text
            style={{
              color: "white",
              backgroundColor: "blue",
              borderRadius: 50,
              marginHorizontal: "auto",
              padding: 10,
              height: 40,
            }}
          >
            Send
          </Text>
        </Pressable>
      </View>
      {showEmojiPicker && (
        <EmojiSelector
          onEmojiSelected={(emoji) => setMessage(message + emoji)}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  messageBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 50,
    padding: 10,
    marginRight: 10,
  },
});

export default ChatPage;
