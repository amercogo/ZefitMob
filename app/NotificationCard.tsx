// NotificationCard.tsx
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";

export type Announcement = { id:string; title:string; body:string; created_at:string; image?:any };

export default function NotificationCard({ item, onPress }: { item: Announcement; onPress?: () => void }) {
  const d = new Date(item.created_at).toLocaleDateString("bs-BA", { day: "2-digit", month: "2-digit", year: "numeric" });

  return (
    <Pressable style={s.card} onPress={onPress} android_ripple={{ color: "rgba(255,255,255,0.06)" }}>
      {/* Lijeva strana – tekst */}
      <View style={s.textCol}>
        <Text style={s.title} numberOfLines={1}>{item.title}</Text>
        <Text style={s.body} numberOfLines={2}>{item.body}</Text>
        <Text style={s.date}>{d}</Text>
      </View>

      {/* Desna strana – slika */}
      <View style={s.imageWrap}>
        <Image
          source={item.image ?? require("../assets/images/p1.jpg")}
          style={s.image}
          contentFit="cover"
          transition={150}
        />
      </View>
    </Pressable>
  );
}

const CARD_H = 200;
const s = StyleSheet.create({
  card: {
    flexDirection: "row",                    // tekst i slika u jednom redu
    alignItems: "stretch",
    backgroundColor: "#3E3F3A",
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    marginLeft:15,
    marginRight:15,
    marginTop:10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.06)",
    height: CARD_H,
  },
  textCol: { flex: 1, paddingRight: 12, justifyContent: "flex-start" },
  title: { color: "#FEFEFD", fontSize: 16, fontWeight: "700",textAlign:"center", marginBottom:20},
  body: { color: "#CDCCC7", marginTop: 4, lineHeight: 20 },
  date: { color: "#CDCCC7", fontSize: 12, opacity: 0.8, marginTop: "auto"},
  imageWrap: {
    width: 140,                               // fiksna širina slike (desna strana)
    borderRadius: 16,
    overflow: "hidden",                       // da dobijemo zaobljene uglove
  },
  image: { width: "100%", height: "100%", borderRadius: 16 },
});
