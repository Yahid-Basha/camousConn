import { Text, View, Button, Alert, Pressable } from "react-native";
import { Image } from "react-native";
import { useRouter } from "expo-router";
const Room = ({ item }: any) => {
  const router = useRouter();
  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };
  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/chatpage",
          params: { roomId: item._id, roomName: item.roomName },
        });
      }}
    >
      <View style={{ marginTop: 15 }}>
        <View style={{ marginLeft: 10, flexDirection: "row", gap: 10 }}>
          <Image
            source={{ uri: item.imageLink || "no-image" }}
            style={{ width: 50, height: 50, borderRadius: 25 }}
            onError={(error) => {
              console.log("Error loading image:", error.nativeEvent.error);
            }}
          />
          <View>
            <View
              style={{
                minWidth: 300,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 18, marginTop: 5 }}>
                {item.roomName}
              </Text>
              {item.lastMessageTime ? (
                <Text
                  style={{ fontSize: 12, marginTop: 5, alignSelf: "flex-end" }}
                >
                  {formatTime(item.lastMessageTime)}
                </Text>
              ) : (
                <Text style={{ fontSize: 12, marginTop: 5 }}>00:00</Text>
              )}
            </View>

            {item.lastMessage ? (
              <Text style={{ fontSize: 14, marginTop: 3 }}>
                {item.lastMessage}
              </Text>
            ) : (
              <Text style={{ fontSize: 14, marginTop: 3 }}>No messages</Text>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default Room;
