import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Stack, router } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../providers/AuthProvider";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const { signInWithEmail, loading } = useAuth();

  const onSubmit = async () => {
    if (!email || !pass) {
      return Alert.alert("Popunite polja", "Unesite email i lozinku.");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Alert.alert("Neispravan email", "Unesite ispravnu email adresu.");
    }

    // Sign in with Supabase
    const { error } = await signInWithEmail(email, pass);

    if (error) {
      Alert.alert(
        "Greška pri prijavi",
        error.message || "Došlo je do greške. Pokušajte ponovo."
      );
      return;
    }

    // Success - redirect to main app
    // The protected layout will handle the redirect automatically
    router.replace("/");
  };
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        {/* Gornji crni header sa logom */}
        <View style={s.header}>
          <Image
            source={require("../../assets/images/wa.png")}
            style={s.logo}
            contentFit="contain"
            transition={150}
          />
        </View>

        {/* Donji zaobljeni "panel" sa gradientom */}
        <View style={s.panelWrap}>
           <View style={s.notchBorder} />
  {/* stvarni rez (crni) */}
               <View style={s.notch} />
          <LinearGradient
            colors={["#FAF043", "#C5FF48"]} // svjetlije gore -> tamnije dolje
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1.4 }}
            style={s.panel}
          >
            <Text style={s.welcome}>Dobro došli u ZeFit aplikaciju!</Text>
            <Text style={s.sub}>Prijavite se kako bi nastavili</Text>

            {/* INPUTI */}
            <View style={s.field}>
              <TextInput
                style={s.input}
                placeholder="Unesite email..."
                placeholderTextColor="#8E8E8E"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={s.field}>
              <TextInput
                style={s.input}
                placeholder="Unesite lozinku..."
                placeholderTextColor="#8E8E8E"
                secureTextEntry
                value={pass}
                onChangeText={setPass}
              />
            </View>
         <View style={s.linksRow}>
          <Text style={s.linkLeft}>Zaboravljena lozinka?</Text>
           <Pressable onPress={() => router.push("/(auth)/register")}>
          <Text style={s.linkRight}>Nemate račun?</Text>
          </Pressable>
          </View>
            {/* DUGME */}
            <Pressable
              style={({ pressed }) => [s.btn, pressed && { opacity: 0.9 }, loading && s.btnDisabled]}
              onPress={onSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#1C1D18" size="small" />
              ) : (
                <Text style={s.btnText}>PRIJAVA</Text>
              )}
            </Pressable>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const PANEL_RADIUS = 28;
const HEADER_BG = "#141410";      // boja headera (crna)
const NOTCH_BASE = 120;           // širina baze "V" reza
const NOTCH_HEIGHT = 80;          // visina "V" reza
const LOGO_W = 160;
const LOGO_H = 110;


const s = StyleSheet.create({
  header: {
    height: 220,
    backgroundColor: "#141410", // tamnija crna kao na dizajnu
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 8,
     position: "relative",   // važno
      overflow: "visible",  
       zIndex: 5,             // iznad notch-a
  elevation: 5,          // Android stacking
  },
  logo: { width: 300, height: 300 ,
    marginLeft: -(LOGO_W / 1.846),   // centriranje
  bottom: -(NOTCH_HEIGHT * 1.6), // "uvaliti" u usjek (podesi po želji)
   position: "absolute",
  left: "33.9%",
  zIndex: 6,         // iznad svega
  elevation: 6,      // Android
  
  },

  panelWrap: {
    flex: 1,
    backgroundColor: "#141410", 
     position: "relative", 
  },

  panel: {
    flex: 1,
    borderTopLeftRadius: PANEL_RADIUS * 1.5,
    borderTopRightRadius: PANEL_RADIUS * 1.5,
    paddingHorizontal: 22,
    paddingTop: 18,
    // blagi "glow" žutog panela
    shadowColor: "#E6FF66",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },
  // --- TROKUT REZ ---
  notchBorder: {
    position: "absolute",
    top: -1,                        // mrvicu iznad panela
    left: "50%",
    marginLeft: -(NOTCH_BASE/2 + 4),
    width: 0,
    height: 0,
    borderLeftWidth: NOTCH_BASE/2 + 4,
    borderRightWidth: NOTCH_BASE/2 + 4,
    borderTopWidth: NOTCH_HEIGHT + 4,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
     // tanki bijeli rub (opcionalno)
    zIndex: 2,
  },
   notch: {
    position: "absolute",
    top: 0,
    left: "50%",
    marginLeft: -(NOTCH_BASE/2),
    width: 0,
    height: 0,
    borderLeftWidth: NOTCH_BASE/2,
    borderRightWidth: NOTCH_BASE/2,
    borderTopWidth: NOTCH_HEIGHT,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: HEADER_BG,      // isto kao header -> izgleda kao "usjek"
    zIndex: 3,
  },

  welcome: {
    color: "#1C1D18",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 90,
  },
  sub: {
    color: "#3E3F3A",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 50  ,
  },

  field: {
    marginBottom: 18, marginLeft:30, marginRight:30,
  },
  input: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#FEFEFD",
    color: "#1C1D18",
    // unutrašnji "soft" izgled
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.08)",
  },

linksRow: {
  flexDirection: "row",
  justifyContent: "space-between", // lijevo / desno
  alignItems: "center",
  marginTop:-10,
  marginBottom:20
  
},

linkLeft:  { marginLeft:45,color: "rgba(28,29,24,0.65)", fontSize: 12 },
linkRight: { marginRight:40,color: "rgba(28,29,24,0.65)", fontSize: 12, },



  btn: {
    height: 50,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF144", // žuto dugme
    // shadow da izgleda izdignuto
    shadowColor: "#946429ff",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
    marginHorizontal: 100,
    marginTop: 4,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: { color: "#1C1D18", fontWeight: "700" },
});

