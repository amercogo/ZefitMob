import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useAuth } from "../../providers/AuthProvider";

export default function Profile() {
  const { user, member, signOut } = useAuth();

  const onLogout = async () => {
    // Sign out using Supabase auth
    await signOut();
    // Redirect to login - the protected layout will handle this automatically
    router.replace("/(auth)/login");
  };
  return (
    <View style={s.screen}>
      {/* Profilna */}
      <View style={s.header}>
        <Image
          source={require("../../assets/images/user.png")}
          style={s.avatar}
          contentFit="cover"
        />
      </View>

      {/* Podaci */}
      <View style={s.form}>
        <Text style={s.label}>Ime i prezime</Text>
        <TextInput 
          style={s.input} 
          placeholder="Unesi ime i prezime" 
          placeholderTextColor="#1C1D18"
          value={member?.ime_prezime || ""}
          editable={false}
        />

        <Text style={s.label}>Email</Text>
        <TextInput
          style={s.input}
          placeholder="imeprez@example.com"
          placeholderTextColor="#1C1D18"
          keyboardType="email-address"
          autoCapitalize="none"
          value={member?.email || user?.email || ""}
          editable={false}
        />

        <Text style={s.label}>Telefon</Text>
        <TextInput
          style={s.input}
          placeholder="+1234567890"
          placeholderTextColor="#1C1D18"
          keyboardType="phone-pad"
          value={member?.telefon || ""}
          editable={false}
        />

        <Text style={s.label}>Član kod</Text>
        <TextInput
          style={s.input}
          placeholder="CLAN-XXXX"
          placeholderTextColor="#1C1D18"
          value={member?.clan_kod || ""}
          editable={false}
        />

        <Pressable style={s.resetBtn} onPress={() => { /* TODO: reset password */ }}>
          <Text style={s.resetTxt}>Reset šifre</Text>
        </Pressable>
      </View>

      {/* Akcije na dnu */}
      <View style={s.footer}>
        <Pressable style={s.logoutBtn}  onPress={onLogout}>
          <Text style={s.logoutTxt}>Odjava</Text>
        </Pressable>

        <Pressable onPress={() => { /* TODO: delete account */ }}>
          <Text style={s.deleteTxt}>Izbriši profil</Text>
        </Pressable>
      </View>
    </View>
  );
}
//Treba se na ovome raditi jos 
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#1C1D18", padding: 16 },
  header: { alignItems: "center", marginTop: 80, marginBottom: 16 },
  avatar: { width: 110, height: 110, borderRadius: 55, backgroundColor: "rgba(250, 240, 67, 0.90)" },

  form: { gap: 8 },
  label: { color: "#CDCCC7", fontSize: 13, marginTop: 6 },
  input: {
    backgroundColor: "rgba(250, 240, 67, 0.90)",
    color: "#1C1D18",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,//chat sta je hairlineWidth haa?
    borderColor: "rgba(255,255,255,0.08)",
  },

  resetBtn: {
    alignSelf: "center",
    marginTop: 10,
    backgroundColor: "#3E3F3A",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.10)",
  },
  resetTxt: { color: "#FEFEFD", fontWeight: "600" },

  footer: {  flexDirection: "row",flex: 1, marginTop:-180, alignItems: "center", justifyContent:"space-between" },
  logoutBtn: {
    backgroundColor: "rgba(250, 240, 67, 0.90)",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginLeft:80,
  },
  logoutTxt: { color: "#101010", fontWeight: "700" },
  deleteTxt: { color: "#D82121", fontSize: 13,marginRight:80, },
});
