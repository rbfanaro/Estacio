import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { database } from "../database/database";
import { addTransaction } from "../database/queries";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

interface Product {
  id: number;
  name: string;
  quantity: number;
}

export default function TransactionsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [quantity, setQuantity] = useState("");
  const [type, setType] = useState<"IN" | "OUT" | null>(null);
  const [note, setNote] = useState("");

  async function loadProducts() {
    const result = await database.getAllAsync<Product>(
      "SELECT id, name, quantity FROM products ORDER BY name ASC",
    );
    setProducts(result.map((p) => ({ ...p, id: Number(p.id) })));
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSaveTransaction() {
    if (!selectedProduct || !quantity || !type) {
      Alert.alert("Erro", "Selecione o produto, tipo e quantidade");
      return;
    }

    const chosen = products.find((p) => p.id === selectedProduct);
    if (!chosen) return;

    if (type === "OUT" && Number(quantity) > chosen.quantity) {
      Alert.alert(
        "Estoque insuficiente",
        "A quantidade informada é maior que o disponível",
      );
      return;
    }

    await addTransaction({
      product_id: selectedProduct,
      type,
      quantity: Number(quantity),
      note,
    });

    Alert.alert("Sucesso", "Transação registrada com sucesso!");
    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🔁 Registrar Transação</Text>

      <Text style={styles.label}>Produto</Text>
      <View style={styles.productContainer}>
        {products.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[
              styles.productButton,
              selectedProduct === p.id && styles.productSelected,
            ]}
            onPress={() => setSelectedProduct(p.id)}
          >
            <Text
              style={{
                color: selectedProduct === p.id ? "#fff" : "#333",
                fontWeight: selectedProduct === p.id ? "600" : "400",
              }}
            >
              {p.name} ({p.quantity})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Tipo de Transação</Text>
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[styles.typeButton, type === "IN" && styles.typeInSelected]}
          onPress={() => setType("IN")}
        >
          <Text
            style={type === "IN" ? styles.typeTextSelected : styles.typeText}
          >
            Entrada
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.typeButton, type === "OUT" && styles.typeOutSelected]}
          onPress={() => setType("OUT")}
        >
          <Text
            style={type === "OUT" ? styles.typeTextSelected : styles.typeText}
          >
            Saída
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Quantidade</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        placeholder="Ex: 5"
      />

      <Text style={styles.label}>Observação</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={note}
        onChangeText={setNote}
        placeholder="Ex: Equipamento emprestado ao setor de TI"
        multiline
      />

      <TouchableOpacity
        onPress={handleSaveTransaction}
        style={styles.saveButton}
      >
        <Text style={styles.saveButtonText}>Salvar Transação</Text>
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
  productContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  productButton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  productSelected: {
    backgroundColor: "#4E9F3D",
  },
  typeContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  typeButton: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  typeInSelected: {
    backgroundColor: "#4E9F3D",
    borderColor: "#4E9F3D",
  },
  typeOutSelected: {
    backgroundColor: "#E94560",
    borderColor: "#E94560",
  },
  typeText: {
    color: "#333",
    fontWeight: "500",
  },
  typeTextSelected: {
    color: "#fff",
    fontWeight: "600",
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
