import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { ProgressBar, DataTable, Card } from 'react-native-paper';
import { PieChart, ProgressChart } from 'react-native-chart-kit';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-expo';

const screenWidth = Dimensions.get('window').width;

const Dashboard = () => {
  const { userId } = useAuth();
  const [userData, setUserData] = useState<{
    name: string;
    gpa: string;
    attendance: number; // If attendance is initially a string
    grades: Record<string, string>;
    upcomingAssignments: { title: string; dueDate: string }[];
    upcomingExams: { subject: string; examDate: string }[];
    achievements: { title: string; date?: string }[];
    extracurricularActivities: string[];
  } | null>(null);

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://192.168.0.103:3000/user/${userId}`)
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [userId]);

  if (!userData) {
    return <Text>Loading...</Text>;
  }

  // Convert attendance to a number if it's a string
  const attendanceProgress = parseFloat(userData.attendance) / 100;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Welcome, {userData.name}</Text>

      {/* Academic Performance */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Academic Performance</Text>
        
        <View style={styles.performanceContainer}>
          {/* GPA Progress Circle */}
          <View style={styles.gpaContainer}>
            <Text style={styles.subTitle}>GPA</Text>
            <ProgressChart
              data={{ data: [parseFloat(userData.gpa) / 10] }}
              width={screenWidth * 0.4}
              height={150}
              strokeWidth={8}
              radius={32}
              chartConfig={chartConfig}
              hideLegend
            />
          </View>

          {/* Attendance Progress Bar */}
          <View style={styles.attendanceContainer}>
            <Text style={styles.subTitle}>Attendance</Text>
            <ProgressBar
              progress={0.6} // Use the converted value
              color="#4CAF50"
              style={styles.attendanceProgressBar}
            />
            <Text style={styles.attendanceText}>{userData.attendance}%</Text>
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
          {Object.entries(userData.grades).map(([subject, grade]) => (
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
        {userData.upcomingAssignments.map((assignment, index) => (
          <Text key={index} style={styles.listItem}>
            {assignment.title} - Due: {new Date(assignment.dueDate).toLocaleDateString()}
          </Text>
        ))}
      </Card>

      {/* Upcoming Exams */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Upcoming Exams</Text>
        {userData.upcomingExams.map((exam, index) => (
          <Text key={index} style={styles.listItem}>
            {exam.subject} - {new Date(exam.examDate).toLocaleDateString()}
          </Text>
        ))}
      </Card>

      {/* Achievements */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        {userData.achievements.map((achievement, index) => (
          <Text key={index} style={styles.listItem}>
            {achievement.title} - {achievement.date && new Date(achievement.date).toLocaleDateString()}
          </Text>
        ))}
      </Card>

      {/* Extracurricular Activities */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Extracurricular Activities</Text>
        {userData.extracurricularActivities.map((activity, index) => (
          <Text key={index} style={styles.listItem}>{activity}</Text>
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
    marginBottom: 15,
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
    alignItems: "center",
  },
  attendanceContainer: {
    alignItems: "center",
    width: "45%",
  },
  attendanceProgressBar: {
    width: "100%",
    height: 15, // Increased height for better visibility
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
});

export default Dashboard;
