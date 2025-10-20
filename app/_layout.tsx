import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

//Ovdje stavljam zasad 8.10.25 da nema status bara
export default function RootLayout() {
  return (
    <View style={{flex:1, backgroundColor:"#1C1D18"}}>
      <StatusBar style="light" backgroundColor="#1C1D18"></StatusBar>
      <Stack 
      initialRouteName="login"
       screenOptions={{
        headerShown: false,               //Da se ukloni header
        contentStyle: { backgroundColor: "#1C1D18"}       //Postavlja boju na onu koju smo odredili da ce biti
      }}></Stack>
    </View>
  );
}
