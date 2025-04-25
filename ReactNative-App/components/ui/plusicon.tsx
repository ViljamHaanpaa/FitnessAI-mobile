import { View, StyleSheet } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";

export const CustomPlusButton = () => {
  return (
    <View style={styles.container}>
      <Icon name="plus-circle" size={55} color="#FFA500" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
});
