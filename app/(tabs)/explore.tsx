import { useUser, useAuth, useClerk } from "@clerk/clerk-expo";
import { Text, View, Button, Alert } from "react-native";
import axios from "axios";
import { clerk } from "@clerk/clerk-expo/dist/provider/singleton";

function handleMongo(user: any) {
  console.log("Sending user data to server:", user);
  axios
    .post("http://10.0.57.76:3000/register", user)
    .then((response) => {
      Alert.alert("User created Successfully", "User created Successfully");
      console.log("Server response:", response);
    })
    .catch((error) => {
      Alert.alert("Error creating user: " + error.message);
      console.log("Error creating user:", error);
    });
}

export default function UseUserExample() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { userId} = useAuth();
  const { signOut, } = useClerk();
  const usera = {
    name: user?.firstName,
    clerkId: userId,
    username: user?.username,
    email: user?.emailAddresses[0]?.emailAddress, // Assuming emailAddresses is an array
  };

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  if (!isSignedIn) {
    return <Text>User not signed in</Text>;
  }

  return (
    <View>
      <Text style={{ marginTop: 50 }}>Hello, {user?.firstName} welcome to Clerk</Text>
      <Button onPress={() => handleMongo(usera)} title="Register User" />
      <Button onPress={async () => await signOut({ redirectUrl: '/' })} title="Sign Out" />
    </View>
  );
}