import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  // Picker,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity as Pressable,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "@clerk/clerk-expo";
import { supabase } from "./supabase";
import { Entypo } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const EditDetails = () => {
  const ipAddress = process.env.HOSTNAME;
  const [category, setCategory] = useState("gpa");
  const [formData, setFormData] = useState<FormData>({});
  const { userId } = useAuth();
  const [imageUrl, setImageUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  interface FormData {
    [key: string]: string;
  }

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      [key]: value,
    }));
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
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Updated for new API
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      try {
        const resultFromSupaBase = await uploadImageToSupabase(
          result.assets[0].uri
        );
        if (resultFromSupaBase) {
          const imageLink =
            resultFromSupaBase.data.publicUrl || "no certificate link";
          console.log("Image Link", imageLink);
          setImageUrl(imageLink);
          handleInputChange("imageLink", imageLink);
          console.log(result.assets[0].uri);
        }
      } catch (error) {
        console.error("Error uploading image: ", error);
      }
    } else {
      console.log("Image upload cancelled");
    }
  };

  const handleSubmit = async () => {
    console.log("Updating user details:", formData);
    try {
      const response = await fetch(
        "http://10.0.57.115:3000/user/updateUserDashboard",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            category,
            data: formData,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        Alert.alert("Success", "User details updated successfully!");
      } else {
        Alert.alert("Error", result.message || "Failed to update details.");
      }
    } catch (error) {
      console.error("Error updating user details:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  const renderInputs = () => {
    switch (category) {
      case "gpa":
        return (
          <TextInput
            style={styles.input}
            placeholder="Enter GPA"
            keyboardType="numeric"
            onChangeText={(value) => handleInputChange("gpa", value)}
          />
        );
      case "attendance":
        return (
          <TextInput
            style={styles.input}
            placeholder="Enter Attendance"
            keyboardType="numeric"
            onChangeText={(value) => handleInputChange("attendance", value)}
          />
        );
      case "grades":
        return (
          <>
            {["Math", "Physics", "Chemistry", "Computer Science"].map(
              (subject) => (
                <View key={subject}>
                  <Text>{subject}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={`Enter grade for ${subject}`}
                    onChangeText={(value) => handleInputChange(subject, value)}
                  />
                </View>
              )
            )}
          </>
        );
      case "upcomingAssignments":
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Assignment Title"
              onChangeText={(value) => handleInputChange("title", value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Due Date (YYYY-MM-DD)"
              onChangeText={(value) => handleInputChange("dueDate", value)}
            />
          </>
        );
      case "upcomingExams":
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Subject"
              onChangeText={(value) => handleInputChange("subject", value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Exam Date (YYYY-MM-DD)"
              onChangeText={(value) => handleInputChange("examDate", value)}
            />
          </>
        );
      case "achievements":
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Title"
              onChangeText={(value) => handleInputChange("title", value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              onChangeText={(value) => handleInputChange("description", value)}
            />
          </>
        );
      case "extracurricularActivities":
        return (
          <TextInput
            style={styles.input}
            placeholder="Enter activity"
            onChangeText={(value) => handleInputChange("activity", value)}
          />
        );
      case "certificates":
        return (
          <>
            {!formData.title && (
              <Text style={{ color: "red", marginLeft: "auto" }}>
                Title is required
              </Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Title (required)"
              onChangeText={(value) => handleInputChange("title", value)}
            />

            <TextInput
              style={styles.input}
              placeholder="Description"
              onChangeText={(value) => handleInputChange("description", value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Issued By"
              onChangeText={(value) => handleInputChange("issuedBy", value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Link for certificate"
              onChangeText={(value) => handleInputChange("link", value)}
            />
            <Pressable style={styles.uploadButton} onPress={pickImage}>
              <Entypo name="camera" size={24} color="white" />
              <Text style={styles.uploadButtonText}>
                {imageUrl ? "Change Image" : "Upload Image"}
              </Text>
            </Pressable>
            {imageUrl ? (
              <View style={{ alignItems: "center", marginTop: 10 }}>
                <Text style={{ color: "green" }}>
                  Image Uploaded Successfully
                </Text>
                <Image
                  source={{ uri: imageUrl }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 10,
                    marginTop: 10,
                  }}
                />
              </View>
            ) : (
              <Text style={{ color: "red", textAlign: "center" }}>
                No image selected
              </Text>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Picker
        selectedValue={category}
        onValueChange={(value) => {
          setCategory(value);
          setFormData({});
        }}
        style={styles.picker}
      >
        <Picker.Item label="GPA" value="gpa" />
        <Picker.Item label="Attendance" value="attendance" />
        <Picker.Item label="Grades" value="grades" />
        <Picker.Item label="Upcoming Assignments" value="upcomingAssignments" />
        <Picker.Item label="Upcoming Exams" value="upcomingExams" />
        <Picker.Item label="Achievements" value="achievements" />
        <Picker.Item label="Certificates" value="certificates" />
        <Picker.Item
          label="Extracurricular Activities"
          value="extracurricularActivities"
        />
      </Picker>
      {renderInputs()}
      <Button
        title="Submit"
        onPress={() => {
          handleSubmit();
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  picker: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  uploadButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  uploadButtonText: {
    color: "white",
    marginLeft: 10,
  },
});

export default EditDetails;
