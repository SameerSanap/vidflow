import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../../constants/images";
import FormField from "../../components/FormField";
import Button from "../../components/Button";
import { Link, router } from "expo-router";
import { createUser } from "../../lib/appwrite";
import { styled } from "nativewind";
import { useAuth } from "../../context/authContext";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

export default function Signup() {
  const { setUser, setIsLogin } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert("Invalid Fields", "Fill All Fields");
      return;
    }
    setIsSubmitting(true);

    try {
      const user = await createUser(form.email, form.password, form.username);
      setUser(user);
      setIsLogin(true);
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StyledSafeAreaView className="bg-primary h-full">
      <StyledScrollView>
        <StyledView className="w-full justify-center min-h-[85vh] px-4 my-6">
          <StyledImage
            source={images.logo}
            className="w-[115px] h-[35px]"
            resizeMode="contain"
          />
          <StyledText className="text-2xl text-white font-semibold mt-10">
            Sign up to Auro
          </StyledText>
          <FormField
            title="Username"
            value={form.username}
            handleChange={(e) => setForm({ ...form, username: e })}
            className="mt-10"
          />
          <FormField
            title="Email"
            value={form.email}
            handleChange={(e) => setForm({ ...form, email: e })}
            className="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChange={(e) => setForm({ ...form, password: e })}
            className="mt-7"
          />
          <Button
            title="Sign Up"
            handlePress={submit}
            isLoading={isSubmitting}
            className="mt-5"
          />

          <StyledView className="justify-center pt-5 flex-row gap-2">
            <StyledText className="text-lg text-gray-100">
              Have an Account?
            </StyledText>
            <Link
              href="SignIn"
              className="text-lg underline text-secondary-200"
            >
              Log In
            </Link>
          </StyledView>
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
}
