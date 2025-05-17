import React, { useRef, useEffect } from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";

export const AutoReverseLottie = () => {
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

    const interval = setInterval(play, 2000); // 2.17s = 2170ms
    return () => clearInterval(interval);
  }, []);

  return (
    <LottieView
      ref={animationRef}
      source={require("../../assets/lottie/LoadingDumbbell.json")}
      loop={false}
      autoPlay={false}
      style={{ width: 200, height: 200 }}
    />
  );
};
