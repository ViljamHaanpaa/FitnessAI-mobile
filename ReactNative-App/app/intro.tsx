import { Image, StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { router } from "expo-router";
import Icon from "@expo/vector-icons/FontAwesome";
export default function IntroScreen() {
  const nextScreen = () => {
    router.push("/GetStarted");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/background1.png")}
        style={styles.backgroundImage}
      />
      <Text style={styles.title}>
        Fitness, Just the Way <Text style={{ color: "#FFA31A" }}>You</Text> like
        It.
      </Text>
      <Text style={styles.titleDescription}>
        Just tell us what you need, and let AI Fitness create the perfect plan—{" "}
        <Text style={{ color: "#FFA31A" }}>anytime, anywhere.</Text>
      </Text>
      <TouchableOpacity style={styles.button} onPress={nextScreen}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 290,
          }}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Icon name="chevron-right" size={20} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    top: 60,
    fontSize: 40,
    color: "#FFFFFF",
    marginBottom: 30,
    textAlign: "center",
    width: 300,
    fontWeight: 400,
    letterSpacing: 1,
    lineHeight: 50,
  },
  titleDescription: {
    top: 40,
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 30,
    textAlign: "center",
    width: 290,
    fontWeight: 400,
    lineHeight: 25,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    resizeMode: "cover",
  },
  button: {
    backgroundColor: "#FFA31A",
    width: 320,
    height: 75,
    bottom: 60,
    borderRadius: 20,
    borderCurve: "continuous",
    justifyContent: "center",
    shadowColor: "#FFA31A",
    position: "absolute",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: 600,
    textAlign: "left",
    paddingLeft: 20,
  },
});
