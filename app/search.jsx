import React, { useState } from "react";
import { TextInput, Button } from "react-native";
import axios from "axios";

const [searchText, setSearchText] = useState("");
const [rooms, setRooms] = useState([]);

const handleSearch = async () => {
  try {
    const response = await axios.get(`/search?query=${searchText}`);
    setRooms(response.data);
  } catch (error) {
    console.error("Error fetching search results:", error);
  }
};

return (
  <View>
    <Text>Search Page</Text>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TextInput
        style={{
          flex: 1,
          borderColor: "gray",
          borderWidth: 1,
          marginRight: 10,
        }}
        placeholder="Search..."
        value={searchText}
        onChangeText={setSearchText}
      />
      <Button title="Search" onPress={handleSearch} />
    </View>
  </View>
);
