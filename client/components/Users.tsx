import { View, Text } from "react-native";
const User = ({ item }: any) => {
  return (
    <View>
      <Text>{item.name}</Text>
      <Text>{item.email}</Text>
    </View>
  );
};
