import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../context/authContext";

export default function AuthLayout() {
  const { isLogin } = useAuth();
  if (isLogin) {
    <Redirect href="/home" />;
  }
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" />
        <Stack.Screen name="Signup" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
