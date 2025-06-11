import React, { useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import colors from "../../styles/colors";

interface InstructionsModalProps {
  exercise: any | null;
  visible: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  exercise,
  visible,
  onClose,
}) => {
  const snapPoints = useMemo(() => ["85%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  console.log("InstructionsModal rendered with exercise:", exercise);
  useEffect(() => {
    if (!visible && bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  }, [visible]);
  return (
    <GestureHandlerRootView
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={visible ? 0 : -1}
        enablePanDownToClose={true}
        onClose={onClose}
        backgroundStyle={{
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          backgroundColor: colors.background,
        }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            pressBehavior="close"
          />
        )}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text style={styles.title}>
            {exercise ? exercise.name : "Instructions"}
          </Text>
          {exercise?.instructions && (
            <BottomSheetView style={{ paddingBottom: 100 }}>
              {Object.entries(exercise.instructions)
                .sort(([a], [b]) => {
                  const numA = parseInt(a.replace(/\D/g, ""), 10);
                  const numB = parseInt(b.replace(/\D/g, ""), 10);
                  return numA - numB;
                })
                .map(([step, text], idx) => (
                  <View
                    key={step}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <View style={styles.stepNumberContainer}>
                      <Text style={styles.stepNumber}>{idx + 1}</Text>
                    </View>
                    <Text style={styles.instructions}>{String(text)}</Text>
                  </View>
                ))}
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </BottomSheetView>
          )}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  section: {
    fontSize: 16,
    color: "#00FF66",
    marginBottom: 12,
  },
  instructions: {
    fontSize: 16,
    color: "#bbb",
    marginBottom: 20,
    width: 300,
    alignSelf: "center",
  },
  stepNumberContainer: {
    width: 20,
    height: 20,
    borderRadius: 15,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    alignSelf: "flex-start",
  },
  stepNumber: {
    color: colors.secondary,
    fontWeight: "bold",
  },
  closeButton: {
    width: 320,
    height: 75,
    borderRadius: 20,
    borderCurve: "continuous",
    alignItems: "center",
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignSelf: "center",
  },
  closeText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: 600,
    textAlign: "center",
  },
});
