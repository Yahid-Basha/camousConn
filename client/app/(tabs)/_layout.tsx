import { Redirect, router } from "expo-router";
import React, { useLayoutEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth, useClerk } from "@clerk/clerk-expo";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Alert, Button, Modal, Pressable, TextInput, View } from "react-native";
import axios from "axios";
import { useState } from "react";
import { Feather, FontAwesome } from "@expo/vector-icons";

import Dashboard from "./index";
import Home from "./home";
import CampusInfoTab from "./campusInfo";
import Page from "./rooms";

const HeaderRight = ({ colorScheme }: { colorScheme: "light" | "dark" }) => {
  const { signOut } = useClerk();
  const { userId } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [imageLink, setImageLink] = useState("");
  const ipAddress = process.env.HOSTNAME;

  const onSignOut = async () => {
    try {
      await signOut({ redirectUrl: "/sign-in" });
    } catch (error: any) {
      Alert.alert("Error signing out", error.message);
    }
  };

  const createRoom = (
    name: string,
    userId: string,
    roomDescription: String,
    imageLink: String
  ) => {
    console.log("Creating room", { roomName: name, roomCreator: userId });
    axios
      .post("https://campusconn.onrender.com/rooms", {
        roomName: name,
        roomCreator: userId,
        roomDescription,
        imageLink,
      })
      .then((response) => {
        console.log("Server response:", response);
        Alert.alert("Room created Successfully", "Room created Successfully");
      })
      .catch((error) => {
        Alert.alert("Error creating room: " + error.message);
        console.log("Error creating room:", error);
      });
  };

  return (
    <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
      <Pressable
        onPress={() => {
          router.push({
            pathname: "/search",
          });
        }}
      >
        <Feather name="search" size={28} color="black" />
      </Pressable>
      <Pressable onPress={() => setModalVisible(true)}>
        <AntDesign name="pluscircleo" size={24} color="black" />
      </Pressable>
      <Pressable onPress={onSignOut} style={{ marginRight: 15 }}>
        <TabBarIcon name="log-out-outline" color={Colors[colorScheme].tint} />
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              width: 300,
              padding: 20,
              backgroundColor: "white",
              borderRadius: 10,
            }}
          >
            <Pressable
              style={{
                marginHorizontal: "auto",
                borderWidth: 5,
                borderColor: "black",
                borderRadius: 50,
                height: 80,
                width: 80,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesome name="user-o" size={55} color="black" />
            </Pressable>
            <TextInput
              placeholder="Room Name"
              value={roomName}
              onChangeText={setRoomName}
              style={{ marginBottom: 10, borderBottomWidth: 1 }}
            />
            <TextInput
              placeholder="Room Description"
              value={roomDescription}
              onChangeText={setRoomDescription}
              style={{ marginBottom: 10, borderBottomWidth: 1 }}
            />
            <TextInput
              placeholder="Image Link"
              value={imageLink}
              onChangeText={setImageLink}
              style={{ marginBottom: 20, borderBottomWidth: 1 }}
            />
            <Button
              title="Create"
              onPress={() => {
                createRoom(
                  roomName,
                  userId || "test",
                  roomDescription,
                  imageLink
                );
                setModalVisible(false);
              }}
              color={Colors[colorScheme].tint}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <>
      <SignedIn>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: "rgb(107, 113, 165)",
          }}
        >
          <Tab.Screen
            name="home"
            component={Home}
            options={{
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  name={focused ? "home" : "home-outline"}
                  color={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name="index"
            component={Dashboard}
            options={{
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  name={focused ? "speedometer" : "speedometer-outline"}
                  color={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name="rooms"
            component={Page}
            options={{
              title: "Rooms",
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  name={focused ? "chatbubble" : "chatbubble-outline"}
                  color={color}
                />
              ),
              headerRight: () => <HeaderRight colorScheme={colorScheme} />,
            }}
          />
          <Tab.Screen
            name="campusInfo"
            component={CampusInfoTab}
            options={{
              title: "Campus Info",
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  name={
                    focused
                      ? "information-circle"
                      : "information-circle-outline"
                  }
                  color={color}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </SignedIn>
      <SignedOut>
        <Redirect href={"/sign-in"} />
      </SignedOut>
    </>
  );
}
