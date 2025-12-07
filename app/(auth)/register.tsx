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

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const { signUpWithEmail, loading } = useAuth();

  const onSubmit = async () => {
    // Validation
    if (!fullName || !email || !pass) {
      return Alert.alert("Popunite polja", "Unesite ime, email i lozinku.");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Alert.alert("Neispravan email", "Unesite ispravnu email adresu.");
    }

    // Validate password length
    if (pass.length < 6) {
      return Alert.alert("Kratka lozinka", "Lozinka mora imati najmanje 6 karaktera.");
    }

    // Validate password confirmation
    if (pass !== confirmPass) {
      return Alert.alert("Lozinke se ne poklapaju", "Potvrdite lozinku ponovo.");
    }

    // Sign up with Supabase and create member in clanovi table
    const { error } = await signUpWithEmail(email, pass, {
      ime_prezime: fullName,
      telefon: phone || undefined,
    });

    if (error) {
      Alert.alert(
        "Greška pri registraciji",
        error.message || "Došlo je do greške. Pokušajte ponovo."
      );
      return;
    }

    // Success - show message and redirect to login or main app
    Alert.alert(
      "Registracija uspješna",
      "Vaš račun je kreiran. Možete se prijaviti.",
      [
        {
          text: "OK",
          onPress: () => {
            // Auto-login after signup, so redirect to main app
            router.replace("/");
          },
        },
      ]
    );
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
          <View style={s.notch} />
          <LinearGradient
            colors={["#FAF043", "#C5FF48"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1.4 }}
            style={s.panel}
          >
            <Text style={s.welcome}>Dobro došli u ZeFit aplikaciju!</Text>
            <Text style={s.sub}>Registrujte se kako biste nastavili</Text>

            {/* INPUTI */}
           {/* Ime i prezime */}
                <View style={s.field}>
                  <TextInput
                    style={s.input}
                    placeholder="Unesite ime i prezime..."
                    placeholderTextColor="#8E8E8E"
                    keyboardType="default"
                    autoCapitalize="words"
                    autoCorrect={false}
                    textContentType="name"
                    autoComplete="name"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>

                {/* Email */}
                <View style={s.field}>
                  <TextInput
                    style={s.input}
                    placeholder="Unesite email..."
                    placeholderTextColor="#8E8E8E"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="emailAddress"
                    autoComplete="email"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                {/* Broj telefona */}
                <View style={s.field}>
                  <TextInput
                    style={s.input}
                    placeholder="Unesite broj telefona..."
                    placeholderTextColor="#8E8E8E"
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    textContentType="telephoneNumber"
                    autoComplete="tel"
                    value={phone}
                    onChangeText={(t) => setPhone(t.replace(/[^\d+]/g, ""))} // samo cifre i +
                    maxLength={20}
                  />
                </View>

                {/* Lozinka */}
                <View style={s.field}>
                  <TextInput
                    style={s.input}
                    placeholder="Kreirajte lozinku..."
                    placeholderTextColor="#8E8E8E"
                    secureTextEntry
                    textContentType="password"
                    autoComplete="new-password"
                    value={pass}
                    onChangeText={setPass}
                  />
                </View>

                {/* Potvrda lozinke */}
                <View style={s.field}>
                  <TextInput
                    style={s.input}
                    placeholder="Potvrdite lozinku..."
                    placeholderTextColor="#8E8E8E"
                    secureTextEntry
                    textContentType="password"
                    autoComplete="new-password"
                    value={confirmPass}
                    onChangeText={setConfirmPass}
                  />
                </View>


            <View style={s.linksRow}>
              {/* ovo je ekran registracije → link vodi NA login */}
              <Pressable onPress={() => router.push("/(auth)/login")}>
                <Text style={s.linkLeft}>Imate račun? Prijava</Text>
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
                <Text style={s.btnText}>REGISTRACIJA</Text>
              )}
            </Pressable>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const PANEL_RADIUS = 28;
const HEADER_BG = "#141410";
const NOTCH_BASE = 120;
const NOTCH_HEIGHT = 80;
const LOGO_W = 160;

const s = StyleSheet.create({
  header: {
    height: 220,
    backgroundColor: HEADER_BG,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 8,
    position: "relative",
    overflow: "visible",
    zIndex: 5,
    elevation: 5,
  },
  logo: {
    width: 300,
    height: 300,
    marginLeft: -(LOGO_W / 1.846),
    bottom: -(NOTCH_HEIGHT * 1.6),
    position: "absolute",
    left: "33.9%",
    zIndex: 6,
    elevation: 6,
  },
  panelWrap: {
    flex: 1,
    backgroundColor: HEADER_BG,
    position: "relative",
  },
  panel: {
    flex: 1,
    borderTopLeftRadius: PANEL_RADIUS * 1.5,
    borderTopRightRadius: PANEL_RADIUS * 1.5,
    paddingHorizontal: 22,
    paddingTop: 18,
    shadowColor: "#E6FF66",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },
  notchBorder: {
    position: "absolute",
    top: -1,
    left: "50%",
    marginLeft: -(NOTCH_BASE / 2 + 4),
    width: 0,
    height: 0,
    borderLeftWidth: NOTCH_BASE / 2 + 4,
    borderRightWidth: NOTCH_BASE / 2 + 4,
    borderTopWidth: NOTCH_HEIGHT + 4,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    zIndex: 2,
  },
  notch: {
    position: "absolute",
    top: 0,
    left: "50%",
    marginLeft: -(NOTCH_BASE / 2),
    width: 0,
    height: 0,
    borderLeftWidth: NOTCH_BASE / 2,
    borderRightWidth: NOTCH_BASE / 2,
    borderTopWidth: NOTCH_HEIGHT,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: HEADER_BG,
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
    marginBottom: 50,
  },
  field: {
    marginBottom: 18,
    marginLeft: 30,
    marginRight: 30,
  },
  input: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#FEFEFD",
    color: "#1C1D18",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.08)",
  },
  linksRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: -10,
    marginBottom: 20,
  },
  linkLeft: { marginLeft: 45, color: "rgba(28,29,24,0.65)", fontSize: 12 },
  btn: {
    height: 50,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF144",
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

