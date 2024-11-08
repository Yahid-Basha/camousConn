import { useUser } from "@clerk/clerk-expo";
import { Text, View, Button } from "react-native";
import { useClerk } from "@clerk/clerk-expo";

export default function UseUserExample() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  if (!isSignedIn) {
    return <Text>User not signed in</Text>;

  }

  return (
    <View>
      <Text
      style = {{fontSize: 20, marginTop: 30, color: 'white', textAlign: 'center'}}
      >Hello, {user.firstName} welcome to Clerk</Text>
      <Button  onPress={async () => await signOut({ redirectUrl: '/sign-in' })} title="Sign Out" />
    </View>
  );
}