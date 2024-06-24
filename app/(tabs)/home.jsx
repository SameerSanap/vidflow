import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  RefreshControl,
} from "react-native";
import images from "../../constants/images";
import Search from "../../components/Search";
import EmptyState from "../../components/EmptyState";
import { getLatestPosts, getPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import Trending from "../../components/Trending";
import { useAuth } from "../../context/authContext";

export default function Home() {
  const { data: posts, loading: loadingPosts, refetch } = useAppwrite(getPosts);
  const { data: latestPosts, loading: loadingLatestPosts } =
    useAppwrite(getLatestPosts);
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-screen">
      <FlatList
        data={posts}
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
          <View className="my-16 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="text-sm font-pmedium text-gray-100">
                  Welcome Back!
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {user?.username}
                </Text>
              </View>
              <View>
                <Image source={images.logoSmall} className="w-8 h-9" />
              </View>
            </View>
            <Search />
            <View className="w-full flex-1 pt-5">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Trending AI Images
              </Text>
              {loadingLatestPosts ? (
                <Text>Loading...</Text>
              ) : (
                <Trending posts={latestPosts} />
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos created yet"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}
