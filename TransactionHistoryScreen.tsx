import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { database } from "../database/database";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useCallback } from "react";

interface Transaction {
  id: number;
  type: "IN" | "OUT";
  quantity: number;
  note: string;
  date: string;
  product_name: string;
}

export default function TransactionHistoryScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  async function loadTransactions() {
    const result = await database.getAllAsync<Transaction>(`
      SELECT
        t.id,
        t.type,
        t.quantity,
        t.note,
        t.created_at as date,
        p.name as product_name
      FROM transactions t
      JOIN products p ON t.product_id = p.id
      ORDER BY t.created_at DESC
    `);
    setTransactions(result);
  }

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, []),
  );

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📜 Histórico de Transações</Text>

      <ScrollView style={styles.scroll}>
        {transactions.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma transação registrada.</Text>
        ) : (
          transactions.map((t) => (
            <View
              key={t.id}
              style={[
                styles.card,
                t.type === "IN" ? styles.cardIn : styles.cardOut,
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.productName}>{t.product_name}</Text>
                <Text
                  style={[
                    styles.typeLabel,
                    t.type === "IN" ? styles.inText : styles.outText,
                  ]}
                >
                  {t.type === "IN" ? "Entrada" : "Saída"}
                </Text>
              </View>

              <Text style={styles.detail}>Quantidade: {t.quantity}</Text>
              {t.note ? <Text style={styles.detail}>📝 {t.note}</Text> : null}
              <Text style={styles.date}>{formatDate(t.date)}</Text>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>⬅ Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  scroll: {
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIn: {
    borderLeftWidth: 6,
    borderLeftColor: "#4E9F3D",
  },
  cardOut: {
    borderLeftWidth: 6,
    borderLeftColor: "#E94560",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
  },
  typeLabel: {
    fontWeight: "600",
  },
  inText: {
    color: "#4E9F3D",
  },
  outText: {
    color: "#E94560",
  },
  detail: {
    color: "#444",
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: "#777",
    marginTop: 6,
  },
  backButton: {
    marginTop: 10,
    alignItems: "center",
    paddingVertical: 10,
  },
  backText: {
    color: "#007AFF",
    fontWeight: "600",
  },
});
