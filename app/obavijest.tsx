// app/obavijest/[id].tsx
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";

export default function ObavijestDetalj() {
  const { title, body, created_at, image } = useLocalSearchParams<{
    title: string; body: string; created_at: string; image?: any;
  }>();
  const d = new Date(created_at).toLocaleString("bs-BA");

  return (
    <>
      {/* Header i modal stil */}
      <Stack.Screen
        options={{
          title: "Obavijest",
          presentation: "modal",   // iOS modal / Android full-screen
          headerTintColor: "#FEFEFD",
          headerStyle: { backgroundColor: "#1C1D18" },
        }}
      />
      <ScrollView style={st.screen} contentContainerStyle={{ paddingBottom: 32 }}>
        {image ? (
          <Image source={image} style={st.hero} contentFit="cover" transition={150} />
        ) : null}

        <View style={st.content}>
          {image ? (
    <Image
      source={require("../assets/images/p1.jpg")}
      style={st.inlineImg}
      contentFit="cover"
      transition={120}
    />
  ) : null}
          <Text style={st.title}>{title}</Text>
          <Text style={st.date}>{d}</Text>
          <Text style={st.body}>{body}</Text>
        </View>
      </ScrollView>
    </>
  );
}

const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#1C1D18" },
  hero: { width: "100%", height: 240 },
  content: { padding: 16 },
  title: { 
    color: "#FEFEFD", 
    fontSize: 22,
     fontWeight: "800", 
     marginBottom: 6 
    },
  date: { color: "#CDCCC7", opacity: 0.8, marginBottom: 14 },
  body: { color: "#FEFEFD", lineHeight: 22, fontSize: 16 },
  inlineImg: {
  width: "100%",
  height: 200,
  borderRadius: 12,
  marginBottom: 12,
},
});
