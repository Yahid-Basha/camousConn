import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { TextInput, Text, Button, Pressable, View } from "react-native";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";

const OptionsPage = () => {
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

  const handlePermissionChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPermission = event.target.value;
    setPermission(newPermission);

    try {
      await axios.post("/changePermission", {
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
      await axios.post("/changeGroupName", {
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
      await axios.post("/changeImageLink", {
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
    <View style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Text>Manage Permissions for {roomName}</Text>
      <RadioButtonGroup
        containerStyle={{ marginBottom: 10 }}
        selected={permission}
        onSelected={(value) => setPermission(value)}
        radioBackground="blue"
      >
        <RadioButtonItem value="write" label="Everyone" />
        <RadioButtonItem value="admin" label="Only Admins" />
      </RadioButtonGroup>
      <View>
        <Text>Update Room Name</Text>
        <TextInput
          style={{
            borderColor: "gray",
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          value={updatedroomName}
          onChange={(e) => setUpdatedRoomName(e.target.value)}
        />
        <Pressable
          style={{
            backgroundColor: "blue",
            padding: 10,
            borderRadius: 20,
            width: 175,
          }}
          onPress={handleGroupNameChange}
        >
          <Text style={{ color: "white", marginHorizontal: "auto" }}>
            Update Group Name
          </Text>
        </Pressable>
      </View>
      <View>
        <Text>Update Image Link</Text>
        <TextInput
          style={{
            borderColor: "gray",
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          value={imageLink}
          onChange={(e) => setImageLink(e.target.value)}
        />
        <Pressable
          style={{
            backgroundColor: "blue",
            padding: 10,
            borderRadius: 20,
            width: 175,
          }}
          onPress={handleImageLinkChange}
        >
          <Text style={{ color: "white", marginHorizontal: "auto" }}>
            Update Image Link
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default OptionsPage;
