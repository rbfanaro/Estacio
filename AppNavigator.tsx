import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import AddProductScreen from "../screens/AddProductScreen";
import TransactionsScreen from "../screens/TransactionsScreen";
import TransactionHistoryScreen from "../screens/TransactionHistoryScreen";

export type RootStackParamList = {
  Home: undefined;
  AddProduct: undefined;
  Transactions: undefined;
  TransactionHistory: undefined; // 🆕
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddProduct" component={AddProductScreen} />
      <Stack.Screen name="Transactions" component={TransactionsScreen} />

      <Stack.Screen
        name="TransactionHistory"
        component={TransactionHistoryScreen}
      />
    </Stack.Navigator>
  );
}
