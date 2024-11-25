"use client";
import React, { useState } from "react";
import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  if (!isLoaded) {
    return null;
  }

  // Redirect signed-in users to the home page
  if (isSignedIn) {
    router.push("/");
  }

  // Send the password reset code
  async function create() {
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setSuccessfulCreation(true);
      setError("");
    } catch (err: any) {
      console.error("Error:", err.errors[0].longMessage);
      setError(err.errors[0].longMessage);
    }
  }

  // Reset the password
  async function reset() {
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result.status === "needs_second_factor") {
        setSecondFactor(true);
        setError("");
      } else if (result.status === "complete") {
        setActive({ session: result.createdSessionId });
        setError("");
        router.push("/");
      }
    } catch (err: any) {
      console.error("Error:", err.errors[0].longMessage);
      setError(err.errors[0].longMessage);
    }
  }

  return (
    <View style={styles.background}>
      <Text style={styles.title}>Campus Connex</Text>
      <View style={styles.container}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          Forgot Password?
        </Text>

        {!successfulCreation && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TouchableOpacity style={styles.button} onPress={create}>
              <Text style={styles.buttonText}>Request OTP</Text>
            </TouchableOpacity>
            {error && <Text style={styles.error}>{error}</Text>}
          </>
        )}

        {successfulCreation && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter your new password"
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter the reset code"
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
              value={code}
              onChangeText={setCode}
            />
            <TouchableOpacity style={styles.button} onPress={reset}>
              <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
            {error && <Text style={styles.error}>{error}</Text>}
          </>
        )}

        {secondFactor && (
          <Text style={styles.error}>
            2FA is required, but this UI does not handle that.
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    padding: 20,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 1)", // White background
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "rgba(0, 0, 0, 1)",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgb(186, 186, 186)",
    fontSize: 16,
  },
  button: {
    width: "60%",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "rgb(107, 113, 165)", // Lavender button
    marginTop: 20,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});

export default ForgotPasswordPage;
