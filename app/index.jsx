import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../constants/images";
import Button from "../components/Button";
import { Redirect, router } from "expo-router";
import { useAuth } from "../context/authContext";

export default function Index() {
  const { isLoading, isLogin } = useAuth();
  if (!isLoading && isLogin) {
    return <Redirect href="/home" />;
  }
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center items-center px-4">
          <Image
            source={images.logo}
            className="w-[200px] h-[60px]"
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[320px]"
            resizeMode="contain"
          />
          <View className="relative mt-5 ">
            <Text className="text-2xl text-white font-bold text-center">
              Discover Endless Posibiities with
              <Text className="text-secondary-200"> Auro</Text>
            </Text>

            <Button
              title="Continue"
              style="mt-7"
              handlePress={() => {
                router.push("/SignIn");
              }}
            />
          </View>
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
