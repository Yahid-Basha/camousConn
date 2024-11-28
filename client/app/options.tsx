import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import {
  TextInput,
  Text,
  Button,
  Pressable,
  View,
  StyleSheet,
} from "react-native";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";

const OptionsPage = () => {
  const ipAddress = process.env.HOSTNAME;
  const router = useRouter();
  const { roomId, roomName } = useLocalSearchParams();
  console.log(roomId, roomName);
  const [permission, setPermission] = useState("admin");
  const [updatedroomName, setUpdatedRoomName] = useState(roomName || "");
  const [imageLink, setImageLink] = useState("");

  useEffect(() => {
    if (!roomId || !roomName) {
      router.push("/");
    }
  }, [roomId, roomName, router]);

  const handlePermissionChange = async (event) => {
    const newPermission = event.target.value;
    setPermission(newPermission);

    try {
      await axios.post("http://ipaddr/changePermission", {
        roomId,
        permission: newPermission,
      });
      alert("Permission updated successfully");
    } catch (error) {
      console.error("Error updating permission:", error);
      alert("Failed to update permission");
    }
  };

  const handleGroupNameChange = async () => {
    try {
      console.log("Updating group name:", updatedroomName);
      await axios.post("https://campusconn.onrender.com/changeGroupName", {
        roomId,
        updatedroomName,
      });
      alert("Group name updated successfully");
    } catch (error) {
      console.error("Error updating group name:", error);
      alert("Failed to update group name");
    }
  };

  const handleImageLinkChange = async () => {
    try {
      await axios.post("https://campusconn.onrender.com/changeImageLink", {
        roomId,
        imageLink,
      });
      alert("Image link updated successfully");
    } catch (error) {
      console.error("Error updating image link:", error);
      alert("Failed to update image link");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Permissions for {roomName}</Text>

      <View style={styles.card}>
        <Text style={styles.subHeader}>Permissions</Text>
        <RadioButtonGroup
          containerStyle={styles.radioGroup}
          selected={permission}
          onSelected={(value) => setPermission(value)}
          radioBackground="blue"
        >
          <RadioButtonItem value="write" label="Everyone" />
          <RadioButtonItem value="admin" label="Only Admins" />
        </RadioButtonGroup>
      </View>

      <View style={styles.card}>
        <Text style={styles.subHeader}>Update Room Name</Text>
        <TextInput
          style={styles.input}
          value={updatedroomName}
          onChangeText={(text) => setUpdatedRoomName(text)}
          placeholder="Enter new room name"
        />
        <Pressable style={styles.button} onPress={handleGroupNameChange}>
          <Text style={styles.buttonText}>Update Group Name</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.subHeader}>Update Image Link</Text>
        <TextInput
          style={styles.input}
          value={imageLink}
          onChangeText={(text) => setImageLink(text)}
          placeholder="Enter image link"
        />
        <Pressable style={styles.button} onPress={handleImageLinkChange}>
          <Text style={styles.buttonText}>Update Image Link</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  input: {
    borderColor: "#DDD",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#F9F9F9",
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default OptionsPage;
