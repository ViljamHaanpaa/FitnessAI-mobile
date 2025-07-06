import React, { useRef, useEffect, useState } from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  runOnJS,
  withSequence,
} from "react-native-reanimated";
import colors from "@/styles/colors";

export const AutoReverseLottie = ({ showCarousel = false }) => {
  const animationRef = useRef<LottieView>(null);
  let isForward = true;

  useEffect(() => {
    const play = () => {
      if (!animationRef.current) return;

      if (isForward) {
        animationRef.current.play(0, 65); // frame 0 → 65
      } else {
        animationRef.current.play(65, 0); // frame 65 → 0
      }

      isForward = !isForward;
    };
    play(); // start first loop
    const interval = setInterval(play, 2000); // 2s
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ alignItems: "center" }}>
      <LottieView
        ref={animationRef}
        source={require("../../assets/lottie/LoadingDumbbell.json")}
        loop={false}
        autoPlay={false}
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
};

// Vertical text carousel below the Lottie animation
const loadingTexts = [
  "Generating workout plan...",
  "Finding the best exercises...",
  "Almost ready...",
  "Finalizing your plan...",
  "Optimizing for your goals...",
  "Selecting the right intensity...",
  "Customizing your routine...",
  "Adding finishing touches...",
  "Warming up your muscles...",
  "Loading exercise details...",
  "Setting up your schedule...",
  "Almost there...",
  "Just a moment...",
  "Getting everything ready...",
  "You got this!",
];

export const LoadingTextCarousel = () => {
  const [loadingIndex, setLoadingIndex] = useState(0);
  const progress = useSharedValue(0); // 0 = visible, 1 = invisible

  const changeText = () => {
    setLoadingIndex((prev) => (prev + 1) % loadingTexts.length);
    // fade back in after text change
    progress.value = withTiming(0, { duration: 500 });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // animate out
      progress.value = withTiming(1, { duration: 800 }, () => {
        runOnJS(changeText)();
      });
    }, 4000); // <-- text stays visible for 4 seconds

    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [1, 0]),
    transform: [
      {
        translateY: interpolate(progress.value, [0, 1], [0, -10]),
      },
    ],
  }));

  return (
    <View
      style={{
        height: 30,
        justifyContent: "center",
        overflow: "hidden",
        marginTop: 10,
      }}
    >
      <Animated.Text
        style={[{ fontSize: 18, color: colors.text }, animatedStyle]}
      >
        {loadingTexts[loadingIndex]}
      </Animated.Text>
    </View>
  );
};
