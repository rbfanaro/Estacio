import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { addCategory, addProduct } from "../database/queries";
import { database } from "../database/database";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

interface Category {
  id: number;
  name: string;
}

export default function AddProductScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState("");

  // Carrega categorias existentes
  async function loadCategories() {
    const result = await database.getAllAsync<Category>(
      "SELECT * FROM categories",
    );
    const parsed = result.map((r) => ({ ...r, id: Number(r.id) }));
    setCategories(parsed);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleAddCategory() {
    if (!newCategory.trim()) {
      Alert.alert("Erro", "Informe o nome da categoria");
      return;
    }

    await addCategory(newCategory.trim());
    setNewCategory("");
    await loadCategories();
  }

  async function handleSaveProduct() {
    if (!name.trim() || !selectedCategory) {
      Alert.alert("Erro", "Informe o nome e a categoria do produto");
      return;
    }

    await addProduct({
      name: name.trim(),
      category_id: selectedCategory,
      quantity: Number(quantity) || 0,
      location: location.trim(),
      description: description.trim(),
    });

    Alert.alert("Sucesso", "Produto cadastrado com sucesso!");
    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>➕ Adicionar Produto</Text>

      <Text style={styles.label}>Nome do Produto</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ex: Notebook Dell"
      />

      <Text style={styles.label}>Categoria</Text>
      <View style={styles.categoryContainer}>
        {categories.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[
              styles.categoryButton,
              selectedCategory === c.id && styles.categorySelected,
            ]}
            onPress={() => setSelectedCategory(c.id)}
          >
            <Text
              style={{
                color: selectedCategory === c.id ? "#fff" : "#333",
                fontWeight: selectedCategory === c.id ? "600" : "400",
              }}
            >
              {c.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Nova categoria"
          value={newCategory}
          onChangeText={setNewCategory}
        />
        <TouchableOpacity
          onPress={handleAddCategory}
          style={styles.addCategoryButton}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Quantidade</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        placeholder="Ex: 10"
      />

      <Text style={styles.label}>Localização</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Ex: Almoxarifado"
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        multiline
        placeholder="Ex: Equipamento usado pela equipe de suporte"
      />

      <TouchableOpacity onPress={handleSaveProduct} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Salvar Produto</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  categoryButton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  categorySelected: {
    backgroundColor: "#4E9F3D",
  },
  addCategoryButton: {
    backgroundColor: "#4E9F3D",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: "#4E9F3D",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelText: {
    color: "#777",
    textAlign: "center",
    marginTop: 12,
  },
});
