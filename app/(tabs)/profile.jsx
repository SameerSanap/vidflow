import React, { useState } from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useAppwrite from "../../lib/useAppwrite";
import { useAuth } from "../../context/authContext";
import { getUserPosts, signOut } from "../../lib/appwrite";

import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";
import { icons } from "../../constants";
import IBox from "../../components/IBox";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { updateProfile } from "../../lib/appwrite";

const Profile = () => {
  const { user, setUser, setIsLogin, refetch } = useAuth();
  const { data: posts } = useAppwrite(() => getUserPosts(user.$id));
  const [profile, setUpdateProfile] = useState(null);
  const [refreshing, setRepreshing] = useState(false);
  const openPicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      setUpdateProfile(selectedAsset);
    }

    try {
      if (profile) {
        console.log("Profie:", profile);
        await updateProfile(profile.uri, user.$id);
        console.log("Profile updated successfully");
      }
    } catch (error) {
      console.log("Error in updating profile", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setIsLogin(false);
      setUser(null);
      router.replace("/SignIn");
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Information", "User dont have post yet");
    }
  };
  const onRepresh = async () => {
    setRepreshing(true);
    refetch();
    setRepreshing(false);
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <View className=" w-full  flex-row ">
              <TouchableOpacity onPress={openPicker}>
                <Image
                  source={icons.upload}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Update
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="w-full items-end pr-10"
                activeOpacity={0.7}
                onPress={handleLogout}
              >
                <Image
                  source={icons.logout}
                  className="w-6 h-10"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <View className="w-16 h-16 border border-secondary-200 rounded-xl justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-xl"
                resizeMode="contain"
              />
            </View>

            <IBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyle="text-lg"
            />
            <View className="mt-5 flex-row">
              <IBox
                title={posts.length || 0}
                subtitle="Posts"
                containerStyles="mr-10"
                titleStyle="text-xl"
              />
              <IBox title="1.2K" subtitle="followers" titleStyle="text-lg" />
            </View>
            <Text className="text-lg text-gray-500 mt-10">
              Your Post History
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No User Found" subtitle="No videos yet" />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRepresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Profile;
