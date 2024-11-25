// AdditionalInfoScreen.tsx
import * as React from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import RNPickerSelect from "react-native-picker-select";

export default function AdditionalInfoScreen() {
  const router = useRouter();
  const { userId } = useAuth();
  const ipAddress = process.env.HOSTNAME;
  const [department, setDepartment] = React.useState("");
  const [regulation, setRegulation] = React.useState("");
  const [interests, setInterests] = React.useState<string[]>([]);
  const [rollno, setRollno] = React.useState("");

  const interestOptions = [
    "Music",
    "Dance",
    "Networks",
    "Machine Learning",
    "Artificial Intelligence",
  ];

  const handleInterestChange = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    if (!department || !regulation || !interests.length || !rollno) {
      Alert.alert("Please fill out all fields");
      return;
    }

    try {
      const additionalInfo = {
        userId,
        department,
        regulation,
        interests,
        rollno,
      };

      await axios.put(
        "http://10.0.57.115:3000/user/update-info",
        additionalInfo
      );
      Alert.alert("User updated successfully!");
      router.replace("/");
    } catch (error) {
      console.error("Error updating user info:", error);
      Alert.alert("Error updating user info");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Dropdown for Department */}
      <Text style={styles.label}>Department</Text>
      <View style={styles.dropdownContainer}>
        <RNPickerSelect
          onValueChange={(value) => setDepartment(value)}
          items={[
            { label: "CE", value: "CE" },
            { label: "CSE", value: "CSE" },
            { label: "AIDS", value: "AIDS" },
            { label: "AIML", value: "AIML" },
            { label: "IT", value: "IT" },
            { label: "ME", value: "ME" },
            { label: "ECE", value: "ECE" },
            { label: "EIE", value: "EIE" },
            { label: "EEE", value: "EEE" },
          ]}
          style={pickerSelectStyles}
          value={department}
          placeholder={{ label: "Select Department", value: "" }}
        />
      </View>

      {/* Dropdown for Regulation */}
      <Text style={styles.label}>Regulation</Text>
      <View style={styles.dropdownContainer}>
        <RNPickerSelect
          onValueChange={(value) => setRegulation(value)}
          items={[
            { label: "VR20", value: "VR20" },
            { label: "VR23", value: "VR23" },
          ]}
          style={pickerSelectStyles}
          value={regulation}
          placeholder={{ label: "Select Regulation", value: "" }}
        />
      </View>

      {/* TextInput for Roll Number */}
      <TextInput
        style={styles.input}
        placeholder="Enter your Roll Number"
        placeholderTextColor="#6c757d"
        value={rollno}
        onChangeText={setRollno}
      />

      {/* Checkboxes for Interests */}
      <Text style={styles.label}>Interests</Text>
      {interestOptions.map((interest) => (
        <View key={interest} style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => handleInterestChange(interest)}
          >
            <View
              style={
                interests.includes(interest)
                  ? styles.checkboxSelected
                  : styles.checkboxUnselected
              }
            />
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>{interest}</Text>
        </View>
      ))}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Style definitions
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2b2e4a",
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4a4e69",
    marginTop: 10,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  dropdownContainer: {
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ced4da",
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginVertical: 10,
    elevation: 2, // Shadow effect for Android
    shadowColor: "#000", // Shadow effect for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  input: {
    width: "90%",
    padding: 10,
    marginVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ced4da",
    backgroundColor: "#ffffff",
    fontSize: 16,
    color: "#495057",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: "#4a4e69",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 4,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  checkboxUnselected: {
    width: 16,
    height: 16,
  },
  checkboxSelected: {
    width: 16,
    height: 16,
    backgroundColor: "rgb(107, 113, 165)",
  },
  submitButton: {
    width: "30%",
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgb(107, 113, 165)",
    alignItems: "center",
    marginTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});

// Custom styles for Picker Select
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    color: "#495057",
    backgroundColor: "#ffffff",
    width: "100%",
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    color: "#495057",
    backgroundColor: "#ffffff",
    width: "100%",
  },
});
