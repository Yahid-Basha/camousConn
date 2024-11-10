import { useUser, useAuth, useClerk } from "@clerk/clerk-expo";
import { Text, View, Button, Alert } from "react-native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import User from "@/api/models/user";
import Room from "@/components/Rooms";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView, RefreshControl } from "react-native";

export default function page() {
  const [rooms, setRooms] = useState<any[]>([]);
  const { userId } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchRooms();
    setRefreshing(false);
  }, []);
  const fetchRooms = () => {
    axios
      .get(`http://10.0.57.76:3000/rooms/${userId}`)
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.log("error retrieving users", error);
      });
  };

  useEffect(() => {
    if (userId) {
      fetchRooms();
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        fetchRooms();
      }
    }, [userId])
  );
  // console.log(rooms);

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  if (!isSignedIn) {
    return <Text>User not signed in</Text>;
  }
  // console.log(rooms[0])

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View>
        {rooms.length > 0 ? (
          rooms.map((item, index) => <Room key={index} item={item} />)
        ) : (
          <Text style={{ color: "white" }}>No rooms available</Text>
        )}
      </View>
    </ScrollView>
  );
}
