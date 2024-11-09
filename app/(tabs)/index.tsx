import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { UserType } from "../../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { useUser, useAuth } from "@clerk/clerk-expo";
import axios from "axios";
import User from "../../components/User";

const HomeScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
    //   const token = await AsyncStorage.getItem("authToken");
    //   const decodedToken = jwt_decode(token);
        //   const userId = decodedToken.userId;
        
        // const { user } = useUser();
        const { isLoaded, isSignedIn, user } = useUser();
        const userId = user ? user.id : "no user id";


        
      setUserId(userId);

      axios
        .get(`http://localhost:8000/users/${userId}`)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.log("error retrieving users", error);
        });
    };

    fetchUsers();
  }, []);

  console.log("users", users);

  return (
    <View>
      <View
        style={{
          padding: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Swift Chat</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Link href="/Chats">
            <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
          </Link>
          <Link href="/Friends">
            <MaterialIcons name="people-outline" size={24} color="black" />
          </Link>
        </View>
      </View>
      <View style={{ padding: 10 }}>
        {users.map((item, index) => (
          <User key={index} item={item} />
        ))}
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
