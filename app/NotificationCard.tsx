import { View, Text, StyleSheet, Pressable } from "react-native";

export type Announcement = {
  id: string;
  title: string;
  body: string;
  created_at: string; // ISO string
};

export default function NotificationCard({ item, onPress }: { item: Announcement; onPress?: () => void }) {
  const d = new Date(item.created_at).toLocaleDateString("bs-BA", { day: "2-digit", month: "2-digit", year: "numeric" });
  return (
    <Pressable style={s.card} onPress={onPress}>
      <Text style={s.title}>{item.title}</Text>
      <Text style={s.body} numberOfLines={2}>{item.body}</Text>
      <Text style={s.date}>{d}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "#3E3F3A",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.06)",
  },
  title: { color: "#FEFEFD", fontSize: 16, fontWeight: "700" },
  body: { color: "#CDCCC7", marginTop: 4, lineHeight: 20 },
  date: { color: "#CDCCC7", marginTop: 8, fontSize: 12, opacity: 0.8 },
});
