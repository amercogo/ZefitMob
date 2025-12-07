import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";

export default function Clanarina() {
  return (
    <View style={s.screen}>
      <Pressable onPress={() => router.back()}>
        <Text style={s.back}>← Nazad</Text>
      </Pressable>

      <Text style={s.title}>Članarina</Text>

      <View style={s.card}>
        <Text style={s.rowTitle}>Vrsta</Text>
        <Text style={s.rowValue}>Studentska</Text>

        <Text style={[s.rowTitle, { marginTop: 10 }]}>Ističe</Text>
        <Text style={s.rowValue}>30.10.2025</Text>
      </View>
    </View>
  );
}
//Uhodao sam se kontam pomalo
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#1C1D18", padding: 16 },
  back: { color: "#CDCCC7", marginBottom: 12 },
  title: { color: "#FEFEFD", fontSize: 22, fontWeight: "700", marginBottom: 12 },
  card: {
    backgroundColor: "#3E3F3A",
    borderRadius: 16,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.06)",
  },
  rowTitle: { color: "#CDCCC7", fontSize: 13 },
  rowValue: { color: "#FEFEFD", fontSize: 16, fontWeight: "600", marginTop: 2 },
});