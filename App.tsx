import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createTables } from "./database/database";
import { AppNavigator } from "./navigation/AppNavigator";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";

export default function App() {
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    async function init() {
      try {
        await createTables();
        console.log("📦 Tabelas criadas com sucesso!");
      } catch (err) {
        console.error("Erro ao criar tabelas:", err);
      } finally {
        setIsReady(true);
      }
    }

    init();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <AppNavigator />
    </NavigationContainer>
  );
}
