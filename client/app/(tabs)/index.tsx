import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  RefreshControl,
  Image,
} from "react-native";
import { ProgressBar, DataTable, Card, IconButton } from "react-native-paper";
import { PieChart, ProgressChart } from "react-native-chart-kit";
import axios from "axios";
import { useAuth } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { blue } from "react-native-reanimated/lib/typescript/Colors";

const screenWidth = Dimensions.get("window").width;

const Dashboard = () => {
  const ipAddress = process.env.HOSTNAME;
  const navigation = useNavigation();
  const { userId } = useAuth();
  const [userData, setUserData] = useState<{
    name: string;
    gpa: number;
    attendance: number;
    grades: Record<string, string>;
    upcomingAssignments: { title: string; dueDate: string }[];
    upcomingExams: { subject: string; examDate: string }[];
    achievements: { title: string; date?: string }[];
    extracurricularActivities: string[];
    certificates: [
      {
        title: string;
        description: string;
        issuedBy: string;
        link?: string;
        imageLink?: string;
      },
    ];
  } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = () => {
    if (userId) {
      axios
        .get(`http://10.0.57.115:3000/user/${userId}`)
        .then((response) => {
          console.log("User data:", response.data);
          setUserData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Dashboard",

      headerRight: () => (
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => {
              router.push({
                pathname: "/edit-details",
              });
            }}
          />
        </View>
      ),
    });
  });

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };

  if (!userData) {
    return <Text>Loading...</Text>;
  }

  const attendanceProgress =
    (userData.attendance ? userData.attendance : 60) / 100;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.header}>Welcome, {userData.name}</Text>

      {/* Academic Performance */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Academic Performance</Text>

        <View style={styles.performanceContainer}>
          {/* GPA Progress Circle */}
          <View style={styles.gpaContainer}>
            <Text style={styles.subTitle}>GPA</Text>

            <View style={{ position: "relative", alignItems: "center" }}>
              <ProgressChart
                data={{
                  data: [(userData.gpa * 95) / 10 / 100],
                }}
                width={screenWidth * 0.4}
                height={90}
                strokeWidth={8}
                radius={35}
                chartConfig={chartConfig}
                hideLegend
              />
              <Text
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: [{ translateX: -20 }, { translateY: -10 }],
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                {userData.gpa.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Attendance Progress Bar */}
          <View style={styles.attendanceContainer}>
            <Text style={styles.subTitle}>Attendance</Text>
            <View style={{ position: "relative", alignItems: "center" }}>
              <ProgressChart
                data={{
                  data: [userData.attendance / 100],
                }}
                width={screenWidth * 0.4}
                height={90}
                strokeWidth={8}
                radius={35}
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // Green color
                }}
                hideLegend
              />
              <Text
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: [{ translateX: -15 }, { translateY: -10 }],
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#4CAF50", // Green color
                }}
              >
                {userData.attendance.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Grades Table */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Recent Grades</Text>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Subject</DataTable.Title>
            <DataTable.Title numeric>Grade</DataTable.Title>
          </DataTable.Header>
          {userData.grades &&
            Object.entries(userData.grades).map(([subject, grade]) => (
              <DataTable.Row key={subject}>
                <DataTable.Cell>{subject}</DataTable.Cell>
                <DataTable.Cell numeric>{grade}</DataTable.Cell>
              </DataTable.Row>
            ))}
        </DataTable>
      </Card>

      {/* Upcoming Assignments */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Upcoming Assignments</Text>
        {userData.upcomingAssignments &&
        userData.upcomingAssignments.length > 0 ? (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Title</DataTable.Title>
              <DataTable.Title numeric>Due Date</DataTable.Title>
            </DataTable.Header>
            {userData.upcomingAssignments.map((assignment, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell>{assignment.title}</DataTable.Cell>
                <DataTable.Cell numeric>
                  {new Date(assignment.dueDate).toLocaleDateString()}
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        ) : (
          <Text style={styles.listItem}>No upcoming assignments</Text>
        )}
      </Card>

      {/* Upcoming Exams */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Upcoming Exams</Text>
        {userData.upcomingExams && userData.upcomingExams.length > 0 ? (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Subject</DataTable.Title>
              <DataTable.Title numeric>Exam Date</DataTable.Title>
            </DataTable.Header>
            {userData.upcomingExams.map((exam, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell>{exam.subject}</DataTable.Cell>
                <DataTable.Cell numeric>
                  {new Date(exam.examDate).toLocaleDateString()}
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        ) : (
          <Text style={styles.listItem}>No upcoming exams</Text>
        )}
      </Card>

      {/* Achievements */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        {userData.achievements &&
          userData.achievements.length > 0 &&
          userData.achievements.map((achievement, index) => (
            <Text key={index} style={styles.listItem}>
              <Text style={{ fontWeight: "bold", color: "blue" }}>
                {achievement.title}
              </Text>{" "}
              - {achievement.description}
              {achievement.date &&
                ` (${new Date(achievement.date).toLocaleDateString()})`}
            </Text>
          ))}
      </Card>

      {/* Extracurricular Activities */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Extracurricular Activities</Text>
        {userData.extracurricularActivities &&
          userData.extracurricularActivities.length > 0 &&
          userData.extracurricularActivities.map((activity, index) => (
            <Text key={index} style={styles.listItem}>
              {activity}
            </Text>
          ))}
      </Card>

      {/* Certificates */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Certificates</Text>
        {userData.certificates &&
          userData.certificates.length > 0 &&
          userData.certificates.map((certificate, index) => (
            <Card key={index} style={styles.card}>
              <Text style={{ fontWeight: "bold", color: "blue" }}>
                {certificate.title}
              </Text>
              {certificate.issuedBy && (
                <Text style={styles.listItem}>
                  Issued By: {certificate.issuedBy}
                </Text>
              )}
              <Text style={styles.listItem}>{certificate.description}</Text>
              {certificate.imageLink && (
                <Image
                  source={{ uri: certificate.imageLink }}
                  style={styles.certificateImage}
                />
              )}
            </Card>
          ))}
      </Card>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#555",
  },
  listItem: {
    fontSize: 16,
    marginVertical: 5,
    color: "#555",
  },
  performanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  gpaContainer: {
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  attendanceContainer: {
    alignItems: "center",
    width: "45%",
  },
  attendanceProgressBar: {
    width: "100%",
    height: 15,
    borderRadius: 7.5,
    marginTop: 8,
  },
  attendanceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 4,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  certificateImage: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
});

export default Dashboard;
