import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, Dimensions, ScrollView } from 'react-native';
import axios from 'axios';
import { Image, Linking } from 'react-native';
import { useUser, useAuth, useClerk } from "@clerk/clerk-expo";


type CampusInfo = {
  academicCalendarUrl: string;
  syllabusUrl: string;
};

const CampusInfoTab: React.FC = () => {
  const [campusInfo, setCampusInfo] = useState<CampusInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [regulation, setRegulation] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);

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
    console.log("Fetching campus info for regulation:", regulation, "and department:", department);

    axios
      .get(`http://192.168.0.103:3000/campus-info`, {
        params: {
          regulation,
          department
        }
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
      });
  };

  const fetchUserData = async (userId: string) => {
    try {
      const response = await axios.get(`http://192.168.0.103:3000/user`, {
        params: {
          userId
        }
      })
      const userData = response.data;
      console.log('User data:', response.data);

      // Set regulation and department from user data
      setRegulation(userData.regulation);
      setDepartment(userData.department);
    } catch (error) {
      console.error('Error fetching user data:', error);
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
    <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.container}>
      {/* <Text style={styles.title}>Campus Information</Text> */}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Academic Calendar</Text>
        <Text style={styles.cardDescription}>
          Access the academic calendar for important dates and schedules for this regulation and department.
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL(campusInfo.academicCalendarUrl)} style={styles.button}>
          <Text style={styles.buttonText}>View Academic Calendar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Syllabus</Text>
        <Text style={styles.cardDescription}>
          Check the syllabus for this academic year, including course details and credits.
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL(campusInfo.syllabusUrl)} style={styles.button}>
          <Text style={styles.buttonText}>View My Syllabus</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
          <Text style={styles.cardTitle}>Ongoing Exam Schedule</Text>
          <Text style={styles.cardDescription}>
            Here’s the schedule for ongoing exams. Make sure to prepare accordingly!
          </Text>
          <Image
            source={require('../../assets/images/exam-schedule.png')}
            style={styles.examImage}
            resizeMode="contain"
            />
        </View>
    </View>
    </ScrollView>



  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    justifyContent: 'flex-start',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgb(107, 113, 165)',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  button: {
    backgroundColor: 'rgb(107, 113, 165)',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  examImage: {
    width: Dimensions.get('window').width - 80, // Responsive width
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
});

export default CampusInfoTab;
