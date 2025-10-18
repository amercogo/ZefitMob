import { Text, View, StyleSheet, Pressable, FlatList, RefreshControl  } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router"; 
import NotificationCard, { Announcement } from "../app/NotificationCard";
import { SafeAreaView } from "react-native-safe-area-context";
import BarcodeNavBar from "../components/BarcodeNavBar";


const SHEET_MIN = 88;

const mock: Announcement[] = [
  { id: "1", title: "Radno vrijeme", body: "Danas radimo do 22:00.", created_at: new Date().toISOString(), image: require("../assets/images/p1.jpg") },
  { id: "2", title: "Novi program", body: "Uveden HIIT termin subotom od 10h.", created_at: new Date(Date.now()-86400000).toISOString(), image: require("../assets/images/p2.webp") },
  { id: "3", title: "Akcija", body: "20% popusta na tromjesečnu članarinu.", created_at: new Date(Date.now()-2*86400000).toISOString(), image: require("../assets/images/p3.webp") },
];
export default function Index() {
   const expireText = "Članarina ističe 30.10.2025";
  return (
    <SafeAreaView
      style={styles.screen} 
    >
      <View style={styles.row}>
     <Text style={textStil.title}>Fitness studio ZEFit</Text>
     <Image style={styles.logo}
            source={require("../assets/images/zefit.png")}
            contentFit="contain"
            transition={200} 
     ></Image>
     </View>
     <View style={styles.row}>
      
     </View>
     <View style={styles.rowTiles}>
      <Pressable
        style={styles.avatarBtn}
        onPress={() => router.push("/profile")}
        accessibilityRole="button"
        accessibilityLabel="Otvori profil"
        android_ripple={{ color: "rgba(255,255,255,0.1)", borderless: true }}
      >
        <Image
          source={require("../assets/images/user.png")}
          style={styles.avatarImg}
          contentFit="cover"
          transition={150}
        />
      </Pressable>
       <Pressable
          style={styles.membershipTile}
          onPress={() => router.push("/clanarina")}
        >
          <Text style={styles.membershipTitle}>Članarina</Text>
          <Text style={styles.membershipSubtitle}>{expireText}</Text>
        </Pressable>
        </View>
         <FlatList
        data={mock}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <NotificationCard
            item={item}
            onPress={() =>
              router.push({
                pathname: "/obavijest",
                params: {
                  id: item.id,
                  title: item.title,
                  body: item.body,
                  created_at: item.created_at,
                  image: item.image, // radi s require – ne šalje se preko URL-a, ali expo-router to propusti
               },
            })
            }
/>
        )}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: SHEET_MIN + 24 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => {/* kasnije: refetch */}} tintColor="#FEFEFD" />}
        showsVerticalScrollIndicator={false}
      />
      <BarcodeNavBar onPress={() => router.push("/barcode")} title="Moj barkod" />
    </SafeAreaView>
    
  );
}

const TILE = 70;
/*
Idemo nabolje turbo mode
*/
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#1C1D18",
    padding:16,

  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 100, 
    height: 100,
    marginLeft: 20,
    marginTop: 10
  },
  avatarBtn: {
  marginTop: 16,
  alignSelf: "flex-start",
  width: TILE,
  height: TILE,
  borderRadius: 12,                
  alignItems: "center",             
  justifyContent: "center",         

 
  backgroundColor: "rgba(207, 254, 69, 0.70)",
  

  borderWidth: StyleSheet.hairlineWidth,
  borderColor: "rgba(255,255,255,0.10)",
  marginLeft: 30
},

avatarImg: {
  width: 35,
  height: 35,
  opacity: 0.9, 
},

 membershipTile: {
    flex: 1,                       
    height: TILE,
    borderRadius: 12,
    backgroundColor: "rgba(207, 254, 69, 0.70)", 
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.10)",
    paddingHorizontal: 12,
    justifyContent: "center",
    marginTop: 15,
    marginRight:55,
    marginBottom: 30
  },
  membershipTitle: { color: "#1C1D18", fontSize: 14, fontWeight: "700", textAlign:"center" },
  membershipSubtitle: { color: "#1C1D18", fontSize: 12, marginTop: 2, textAlign:"center" },

   rowTiles: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 0,
    gap: 20, 
  },
});

const textStil = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 600,
    color: "#FFFAFA",
    marginTop: 10,
    marginLeft: 30
  },
});
