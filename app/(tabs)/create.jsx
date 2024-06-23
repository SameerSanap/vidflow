import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import { Video, ResizeMode } from "expo-av";
import icons from "../../constants/icons";
import Button from "../../components/Button";
// import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { upload } from "../../lib/appwrite";
import { useAuth } from "../../context/authContext";
import { router } from "expo-router";

export default function create() {
  const { user } = useAuth();
  const [isSubmiting, setisSubmiting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });
  const openPicker = async (selectType) => {
    // const result = await DocumentPicker.getDocumentAsync({
    //   type:
    //     selectType === "image"
    //       ? ["image/png", "image/jpeg"]
    //       : ["video/mp4", "video/gif"],

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      if (selectType === "image") {
        setForm({ ...form, thumbnail: result.assets[0] });
      }
      if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] });
      }
    }
  };
  async function submit() {
    if (!form.prompt || !form.video || !form.title) {
      return Alert.alert("Please fill in all the fields");
    }
    setisSubmiting(true);

    try {
      await upload({ ...form, userId: user.$id });
      Alert.alert("Success", "Post uploaded!");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({ title: "", video: null, thumbnail: null, prompt: "" });
      setisSubmiting(false);
    }
  }
  return (
    <SafeAreaView className="h-full bg-primary">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-fsemibold">
          Upload Videos
        </Text>
        <FormField
          title="Video Title"
          value={form.title}
          placeholder="Video Title"
          handleChange={(e) => setForm({ ...form, title: e })}
          style="mt-10"
        />
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100">Upload Video</Text>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-60 rounded-xl mt-3"
                resizeMode={ResizeMode.COVER}
                onPlaybackStatusUpdate={(status) => {
                  console.log(status);
                  if (status.didJustFinish) {
                    setPlay(false);
                  }
                }}
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-xl justify-center items-center">
                <View className="w-12 h-12 border border-secondary-200 justify-center items-center">
                  <Image
                    source={icons.upload}
                    className="w-1/2 h-1/2"
                    resizeMode="contain"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-2xl text-white font-fsemibold">
            Tuhumbnail Image
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View
                className="w-full h-16 px-4 bg-black-100 rounded-xl justify-center items-center border-2
              border-black-200 flex-row space-x-2"
              >
                <Image
                  source={icons.upload}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose File
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormField
          title="Prompt"
          value={form.prompt}
          placeholder="Video Promt to make video"
          handleChange={(e) => setForm({ ...form, prompt: e })}
          style="mt-7"
        />
        <Button
          title="Submit"
          handlePress={submit}
          style="mt-7"
          isLoading={isSubmiting}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
