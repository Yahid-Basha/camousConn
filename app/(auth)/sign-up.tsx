import * as React from "react";
import axios from "axios";
import { TextInput, Button, View, Alert, Text, StyleSheet } from "react-native";
import { useSignUp, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");


  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
        firstName: name,
        username,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      Alert.alert(err.errors[0].message, "", [{ text: "OK", style: "cancel" }]);
      // console.error(JSON.stringify(err, null, 2));
      console.log(err.errors[0].message);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      Alert.alert(err.message);
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View>
      <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>
      {!pendingVerification && (
        <>
          <TextInput
            style={styles.input}
              autoCapitalize="none"
              value={name}
              placeholder="Enter your name"
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
            onChangeText={(name) => setName(name)}
          />
          <TextInput
            style={styles.input}
              autoCapitalize="none"
              value={username}
              placeholder="Enter your username"
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
            onChangeText={(username) => setUsername(username)}
          />
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter your email"
            onChangeText={(email) => setEmailAddress(email)}
          />
          <TextInput
            style={styles.input}
            value={password}
            placeholder="Enter your password"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <View style={styles.button}>
              <Text style={styles.buttonText} onPress={onSignUpPress}>
                Sign Up
              </Text>
            </View>
        </>
      )}
      {pendingVerification && (
        <>
          <TextInput
            style={styles.input}
            value={code}
            placeholder="Enter verification code"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            onChangeText={(code) => setCode(code)}
          />
          <View style={styles.button}>
              <Text style={styles.buttonText} onPress={onPressVerify}>
                Verify Email
              </Text>
            </View>
        </>
      )}
    </View>
  </View>
  </View>
  );
}


const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 1)', // Solid white background
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.1)', // Light border color for better contrast
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 }, // Increased height for levitating effect
    shadowOpacity: 0.3, // Slightly increased opacity for more pronounced shadow
    shadowRadius: 20, // Increased radius for softer shadow edges
    elevation: 10, // Increased elevation for Android
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: 'rgba(0, 0, 0, 1)',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    color: 'rgb(0, 0, 0)', // Light text color
    borderWidth: 1,
    borderColor: 'rgb(186, 186, 186)',
    fontSize: 16,
  },
  button: {
    width: '40%',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgb(107, 113, 165)', // lavender
    marginTop: 20,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
