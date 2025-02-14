import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";

type Category = {
  id: number;
  title: string;
};

export default function App() {
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async () => {
    if (!categoryTitle.trim()) {
      Alert.alert("Validation Error", "Category title cannot be empty.");
      return;
    }

    try {
      const payload = { title: categoryTitle };

      const response = await axios.post(
        "http://localhost:3000/categories",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);
      setCategoryTitle("");
      fetchCategories();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error creating category:",
          error.response?.data || error.message
        );
        Alert.alert(
          "Error",
          error.response?.data?.message || "Failed to create category."
        );
      } else {
        console.error("Unexpected error:", error);
        Alert.alert("Error", "Something went wrong.");
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Category</Text>
      <TextInput
        style={styles.input}
        placeholder="Category title"
        value={categoryTitle}
        onChangeText={setCategoryTitle}
      />
      <Button title="Add Category" onPress={handleCreateCategory} />
      <Text style={styles.title}>Categories:</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.listItem}>{item.title}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
});
