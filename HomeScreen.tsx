import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { getProductCountByCategory } from "../database/queries";
import { BarChart } from "react-native-gifted-charts";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();

  const [data, setData] = useState<{ name: string; total: number }[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);

  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        const categories = await getProductCountByCategory();
        setData(categories);
        const total = categories.reduce((sum, c) => sum + (c.total || 0), 0);
        setTotalProducts(total);
      }
      loadData();
    }, []),
  );

  // Converte os dados para o formato do gráfico
  const chartData = data.map((item) => ({
    label: item.name || "Sem categoria",
    value: item.total || 0,
    frontColor: "#4E9F3D",
  }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📦 Controle de Estoque de TI</Text>
      <Text style={styles.subtitle}>Total de produtos: {totalProducts}</Text>

      {/* Gráfico de barras */}
      {chartData.length > 0 ? (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Produtos por categoria</Text>
          <BarChart
            data={chartData}
            barWidth={30}
            spacing={20}
            isAnimated
            barBorderRadius={8}
            xAxisLabelTextStyle={{ color: "#555", fontSize: 12 }}
            yAxisTextStyle={{ color: "#555", fontSize: 12 }}
            yAxisThickness={0}
            xAxisThickness={0}
            noOfSections={4}
            height={220}
            backgroundColor="#fff"
            roundedTop
          />
        </View>
      ) : (
        <View style={styles.chartPlaceholder}>
          <Text style={{ color: "#888" }}>Nenhum dado para exibir</Text>
        </View>
      )}

      {/* Lista de categorias */}
      {data.map((item) => (
        <View key={item.name} style={styles.row}>
          <Text style={styles.category}>{item.name || "Sem categoria"}</Text>
          <Text style={styles.quantity}>{item.total}</Text>
        </View>
      ))}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddProduct" as never)}
      >
        <Text style={styles.addButtonText}>+ Adicionar Produto</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: "#E94560" }]}
        onPress={() => navigation.navigate("Transactions" as never)}
      >
        <Text style={styles.addButtonText}>🔁 Registrar Transação</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: "#007AFF" }]}
        onPress={() => navigation.navigate("TransactionHistory" as never)}
      >
        <Text style={styles.addButtonText}>📜 Ver Histórico</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f7f7f7",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  chartContainer: {
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  chartPlaceholder: {
    height: 200,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  category: {
    fontSize: 16,
  },
  quantity: {
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#4E9F3D",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
