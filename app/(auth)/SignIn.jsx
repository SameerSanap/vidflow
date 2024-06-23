import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../../constants/images";
import FormField from "../../components/FormField";
import Button from "../../components/Button";
import { Link, router } from "expo-router";
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useAuth } from "../../context/authContext";

export default function SignIn() {
  const { setIsLogin, setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const submit = async () => {
    try {
      await signIn(form.email, form.password);
      const user = await getCurrentUser();
      setUser(user);
      setIsLogin(true);
      router.push("/home");
    } catch (error) {
      console.error("Error in login:", error);
      setError(error.message);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image
            source={images.logo}
            className="w-[115px] h-[35px]"
            resizeMode="contain"
          />
          <Text className="text-2xl text-white font-semibold mt-10">
            Log in to Auro
          </Text>
          <FormField
            title="Email"
            value={form.email}
            handleChange={(e) => setForm({ ...form, email: e })}
            style="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChange={(e) => setForm({ ...form, password: e })}
            style="mt-7"
          />
          {error && <Text className="text-red-500 mt-2">{error}</Text>}
          <Button title="Sign In" style="mt-5" handlePress={submit} />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100">
              Don't have an account?
            </Text>
            <Link
              href="Signup"
              className="text-lg underline text-secondary-200"
            >
              Register
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
