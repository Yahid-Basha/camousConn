import { View, Text, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import { TextInput, Button, FlatList, Image } from "react-native";
import axios from "axios";
import Feather from "react-native-vector-icons/Feather";
import { useAuth } from "@clerk/clerk-expo";
export default function SearchPage() {
  const { userId } = useAuth();
  const [searchText, setSearchText] = useState("");
  const [rooms, setRooms] = useState([]);
  const [iconName, setIconName] = useState("plus-circle");
  const ipAddress = process.env.HOSTNAME;

  const handleSearch = async () => {
    try {
      console.log("Searching for rooms with text:", searchText);
      const response = await fetch(
        `http://10.0.57.115:3000/search/${searchText}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setRooms(data);
      console.log("Search results:", data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };
  const handleJoin = async (roomId) => {
    try {
      setIconName("loader");
      axios
        .post("http://10.0.57.115:3000/joinRoom", {
          params: { userId, roomId },
        })
        .then((response) => {
          console.log(response.data);
          setIconName("check-circle");
        })
        .catch((error) => {
          console.error("Error joining room:", error);
          setIconName("plus-circle");
        });
    } catch (error) {
      if (response.status === 400) {
        Alert.alert("You are already in this room");
      }
      console.error("Error joining room:", error);
    }
  };
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          style={{
            flex: 1,
            fontSize: 15,
            fontWeight: "bold",
            borderColor: "gray",
            borderWidth: 1,
            marginRight: 10,
            borderRadius: 38,
            margin: 10,
            padding: 8,
          }}
          placeholder="Search Rooms..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <Pressable
          style={{ margin: 10 }}
          onPress={() => {
            handleSearch();
          }}
        >
          <Feather name="search" size={35} color="black" />
        </Pressable>
      </View>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              margin: 5,
              borderColor: "gray",
              borderRadius: 30,
              borderWidth: 1,
              padding: 5,
            }}
          >
            <Image
              source={{ uri: item.imageLink || "no-image" }}
              style={{ width: 50, height: 50, borderRadius: 25, margin: 5 }}
            />
            <View style={{ flex: 1, gap: 5 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  marginTop: 5,
                  marginLeft: 2,
                }}
              >
                {item.roomName}
              </Text>
              <Text> {item.roomDescription}</Text>
            </View>
            <View>
              <Pressable
                onPress={() => {
                  handleJoin(item._id);
                }}
                style={{ borderRadius: 30, padding: 10 }}
              >
                <Feather name={iconName} size={35} color="# " />
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}
