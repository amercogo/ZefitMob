import { Text, View, StyleSheet } from "react-native";
import { Image } from "expo-image";

export default function Index() {
  return (
    <View
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
    </View>
  );
}
/*
Ovo ispod se koristi kako bi stavio background boju
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
    marginTop: 50
  },
});

const textStil = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 600,
    color: "#FFFAFA",
    marginTop: 50,
    marginLeft: 30
  },
});
