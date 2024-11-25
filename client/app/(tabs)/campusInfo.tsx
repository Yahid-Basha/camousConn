import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
  Modal,
  TextInput,
} from "react-native";
import axios from "axios";
import { Image, Linking } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

type CampusInfo = {
  academicCalendarUrl: string;
  syllabusUrl: string;
};

const CampusInfoTab: React.FC = () => {
  const ipAddress = process.env.HOSTNAME;
  const [campusInfo, setCampusInfo] = useState<CampusInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [regulation, setRegulation] = useState<string | null>("VR20");
  const [department, setDepartment] = useState<string | null>("IT");
  const [modalVisible, setModalVisible] = useState(false);

  const [newsText, setNewsText] = useState("");
  const [newsLink, setNewsLink] = useState("");
  const [startDateInput, setStartDateInput] = useState(""); // For text input
  const [endDateInput, setEndDateInput] = useState(""); // For text input

  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (regulation && department) {
      handleFetchCampusInfo();
    }
  }, [regulation, department]);

  const handleFetchCampusInfo = () => {
    console.log(
      "Fetching campus info for regulation:",
      regulation,
      "and department:",
      department
    );

    axios
      .get(`http://10.0.57.115:3000/campus-info`, {
        params: {
          regulation,
          department,
        },
      })
      .then((response) => {
        setCampusInfo(response.data);
        console.log("Campus info fetched successfully:", response.data);
      })
      .catch((error) => {
        Alert.alert("Error fetching campus info", error.message);
        console.log("Error fetching campus info:", error);
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  const fetchUserData = async (userId: string) => {
    try {
      const response = await axios.get(`http://10.0.57.115:3000/user`, {
        params: {
          userId,
        },
      });
      const userData = response.data;
      console.log("User data:", response.data);

      // Set regulation and department from user data
      setRegulation(userData.regulation);
      setDepartment(userData.department);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    handleFetchCampusInfo();
  };

  const handlePostNews = async () => {
    try {
      if (!newsText || !startDateInput || !endDateInput) {
        Alert.alert("Error", "Please fill in all required fields.");
        return;
      }

      // Convert text input to Date objects
      const startDate = new Date(startDateInput);
      const endDate = new Date(endDateInput);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        Alert.alert(
          "Error",
          "Invalid date format. Please use 'YYYY-MM-DD HH:MM'."
        );
        return;
      }

      const response = await axios.post(`http://10.0.57.115:3000/news`, {
        userId,
        text: newsText,
        link: newsLink,
        startDate,
        endDate,
      });

      if (response.status === 201) {
        Alert.alert("Success", "News posted successfully!");
        setModalVisible(false);
        setNewsText("");
        setNewsLink("");
        setStartDateInput("");
        setEndDateInput("");
      } else {
        Alert.alert("Error", response.data.message || "Failed to post news.");
      }
    } catch (error) {
      console.error("Error posting news:", error);
      Alert.alert("Error", "Failed to post news.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!campusInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No campus information available</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Academic Calendar</Text>
          <Text style={styles.cardDescription}>
            Access the academic calendar for important dates and schedules for
            this regulation and department.
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL(campusInfo.academicCalendarUrl)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>View Academic Calendar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Syllabus</Text>
          <Text style={styles.cardDescription}>
            Check the syllabus for this academic year, including course details
            and credits.
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL(campusInfo.syllabusUrl)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>View My Syllabus</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ongoing Exam Schedule</Text>
          <Text style={styles.cardDescription}>
            Here’s the schedule for ongoing exams. Make sure to prepare
            accordingly!
          </Text>
          <Image
            source={require("../../assets/images/exam-schedule.png")}
            style={styles.examImage}
            resizeMode="contain"
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add News</Text>
          <TextInput
            style={styles.input}
            placeholder="News Text"
            value={newsText}
            onChangeText={setNewsText}
          />
          <TextInput
            style={styles.input}
            placeholder="Link (optional)"
            value={newsLink}
            onChangeText={setNewsLink}
          />
          <TextInput
            style={styles.input}
            placeholder="Start Date (YYYY-MM-DD HH:MM)"
            value={startDateInput}
            onChangeText={setStartDateInput}
          />
          <TextInput
            style={styles.input}
            placeholder="End Date (YYYY-MM-DD HH:MM)"
            value={endDateInput}
            onChangeText={setEndDateInput}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handlePostNews}
          >
            <Text style={styles.submitButtonText}>Post News</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
    // justifyContent: "flex-start",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgb(107, 113, 165)",
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "rgb(107, 113, 165)",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  examImage: {
    width: Dimensions.get("window").width - 80, // Responsive width
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgb(107, 113, 165)",
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
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
  datePicker: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "90%",
  },
  datePickerText: {
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 8,
    width: "90%",
    marginBottom: 10,
  },
  submitButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 8,
    width: "90%",
  },
  cancelButtonText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default CampusInfoTab;
