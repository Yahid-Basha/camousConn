import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, Button, View } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <View style={styles.background}>
      <Text style={styles.title}>Campus Connex</Text>
      <View style={styles.container}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Sign In</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter your email"
          placeholderTextColor="rgb(0, 0, 0, 0.5)"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
        <TextInput
          style={styles.input}
          value={password}
          placeholder="Enter your password"
          placeholderTextColor="rgb(0, 0, 0, 0.5)"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <View style={styles.button}>
          <Text style={styles.buttonText} onPress={onSignInPress}>
            Log In
          </Text>
        </View>
        <View style={styles.linkContainer}>
          <Text style={styles.text}>Don't have an account?</Text>
          <Link href="/sign-up">
            <Text style={styles.link}>Register</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  outerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  container: {
    width: "80%",
    padding: 20,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 1)", // Semi-transparent white background for glass effect
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
    color: "rgb(0, 0, 0)", // Light text color
    borderWidth: 1,
    borderColor: "rgb(186, 186, 186)",
    fontSize: 16,
  },
  button: {
    width: "40%",
    paddingVertical: 10,
    borderRadius: 10,
    // backgroundColor: 'rgb(77, 122, 87)', // green
    // backgroundColor: 'rgb(117, 6, 61)', // pink
    // backgroundColor: 'rgb(61, 143, 179)', // blue
    backgroundColor: "rgb(107, 113, 165)", // lavender

    marginTop: 20,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "rgba(0, 0, 0, 1)",
    fontSize: 14,
    marginRight: 5,
  },
  link: {
    // color: 'rgb(77, 122, 87)',
    // color: 'rgb(61, 143, 179)',
    color: "rgb(107, 113, 165)", //lavender
    fontSize: 14,
    fontWeight: "bold",
  },
});
