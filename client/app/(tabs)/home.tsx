import { useAuth } from "@clerk/clerk-expo";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
  Linking,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../supabase";

const Home = () => {
  const [roomMappings, setRoomMappings] = useState<{ [key: string]: string }>(
    {}
  );
  const [roomName, setRoomName] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<any[]>([]); // Fix: Ensure `posts` is typed as an array
  const { userId } = useAuth();
  const [joinedRooms, setJoinedRooms] = useState<Set<string>>(new Set()); // Track joined rooms
  const [news, setNews] = useState<any[]>([]); // Active news
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0); // Current index for scrolling news

  useEffect(() => {
    fetchRooms();
    fetchPosts();
    fetchActiveNews(); // Fetch active news
  }, []);

  useEffect(() => {
    // Auto-scroll news every 3 seconds
    const interval = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % news.length);
    }, 3000);
    return () => clearInterval(interval); // Clear interval on unmount
  }, [news]);

  const fetchRooms = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(
        "https://campusconn.onrender.com/getAllRooms"
      );
      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Expected an array of rooms");
      }

      const mappings: { [key: string]: string } = {};
      data.forEach((room: { roomName: string; _id: string }) => {
        mappings[room.roomName.toLowerCase()] = room._id;
      });

      setRoomMappings(mappings);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      Alert.alert("Error", "Failed to fetch rooms.");
    } finally {
      setRefreshing(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch("https://campusconn.onrender.com/posts");
      const data = await response.json();
      setPosts(data);
      console.log("Fetched posts:", data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      Alert.alert("Error", "Failed to fetch posts.");
    }
  };

  const fetchActiveNews = async () => {
    try {
      const response = await fetch(
        "https://campusconn.onrender.com/news/active"
      );
      const data = await response.json();
      setNews(data["news"]);
      console.log("Fetched news:", data);
    } catch (error) {
      console.error("Error fetching news:", error);
      Alert.alert("Error", "Failed to fetch news.");
    }
  };

  const fetchJoinedRooms = async () => {
    try {
      const response = await fetch(
        `https://campusconn.onrender.com/getJoinedRooms?userId=${userId}`
      );
      const data = await response.json();
      setJoinedRooms(new Set(data.map((room: any) => room._id)));
    } catch (error) {
      console.error("Error fetching joined rooms:", error);
    }
  };

  const joinRoom = async (roomId: string) => {
    try {
      const response = await fetch("https://campusconn.onrender.com/joinRoom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          roomId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to join room: ${response.status}`);
      }

      const data = await response.json();
      Alert.alert("Success", `You have joined the room: ${data.roomName}`);
      setJoinedRooms((prev) => new Set(prev).add(roomId)); // Add room to joined rooms
    } catch (error) {
      console.error("Error joining room:", error);
      Alert.alert("Error", "Failed to join the room.");
    }
  };

  const uploadImageToSupabase = async (uri) => {
    console.log("Trying to upload image to Supabase");
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

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      } else {
        console.log("Image picking canceled.");
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handlePostSubmit = async () => {
    const roomId = getRoomId();
    if (!roomId) return;

    const imageUrl = await handleImageUpload();
    if (!imageUrl) return;

    await createPost(roomId, imageUrl);
  };

  const getRoomId = () => {
    const roomId = roomMappings[roomName.toLowerCase()];
    if (!roomId) {
      Alert.alert("Error", "Room does not exist. Please create it first.");
    }
    return roomId;
  };

  const handleImageUpload = async () => {
    try {
      const imageUrl = await uploadImageToSupabase(image);
      if (!imageUrl) {
        Alert.alert("Error", "Image upload failed.");
      }
      return imageUrl?.data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Image upload failed.");
      return null;
    }
  };

  const createPost = async (roomId, imageUrl) => {
    try {
      const response = await fetch(
        "https://campusconn.onrender.com/createPost",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomName,
            roomId,
            imageUrl,
            caption,
            userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Post created successfully!");
        fetchPosts(); // Refresh posts
        setModalVisible(false);
      } else {
        Alert.alert("Error", result.message || "Failed to create post.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Scrolling News Section */}

      {news.length > 0 && (
        <View style={styles.newsContainer}>
          <TouchableOpacity
            onPress={() => {
              const link = news[currentNewsIndex]?.link;
              if (link) {
                Linking.openURL(link);
              } else {
                Alert.alert("No link available");
              }
            }}
          >
            <Text style={styles.newsText}>{news[currentNewsIndex]?.text}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ScrollView for posts */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchRooms} />
        }
      >
        {posts.map((post, index) => (
          <View key={index} style={styles.postContainer}>
            <View style={{ flexDirection: "row", gap: 0 }}>
              <Text style={styles.roomName}>{post.roomId?.roomName}</Text>

              <Text style={{}}>
                {new Date(post.createdAt).toLocaleDateString("en-GB")}
              </Text>
            </View>
            <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
            <Text style={styles.caption}>{post.caption}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Floating Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modal for post creation */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Room Name"
            value={roomName}
            onChangeText={setRoomName}
          />
          <TextInput
            style={styles.input}
            placeholder="Caption"
            value={caption}
            onChangeText={setCaption}
          />
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.uploadButtonText}>
              {image ? "Change Image" : "Upload Image"}
            </Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} style={styles.postImage} />}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handlePostSubmit}
            >
              <Text style={styles.submitButtonText}>Post</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3F9",
    padding: 10,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  postContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 3 },
  },
  roomName: {
    marginLeft: 5,
    width: "73%",
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  caption: {
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
    color: "#333",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007bff",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  input: {
    width: "90%",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  uploadButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  uploadButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 10,
    width: "20%",
    borderRadius: 8,
    marginBottom: 15,
  },
  submitButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  cancelButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  joinButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  joinButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  newsContainer: {
    backgroundColor: "gray",
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  newsText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
});
