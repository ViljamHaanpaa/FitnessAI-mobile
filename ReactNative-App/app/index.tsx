import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function IndexPage() {
  const isFirstLaunch = true;

  if (isFirstLaunch === null) {
    // Still loading
    return null;
  }

  if (isFirstLaunch) {
    return <Redirect href="/intro" />;
  } else {
    return <Redirect href="/(tabs)" />;
  }
}
