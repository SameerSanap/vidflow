import React, { useEffect, useState } from "react";
import { FlatList, Image, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBookmark } from "../../context/bookmarkContext";
import { useAuth } from "../../context/authContext";
import { images } from "../../constants";
import EmptyState from "../../components/EmptyState";
import Search from "../../components/Search";
import VideoCard from "../../components/VideoCard";

const Bookmark = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { bookmarks, fetchBookmark, refetch } = useBookmark();

  useEffect(() => {
    const getBookmark = async () => {
      await fetchBookmark();
    };
    getBookmark();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-screen">
      <FlatList
        data={bookmarks}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.videoId}
            creator={item.creatorId}
            avatar={item.avatar}
          />
        )}
        ListHeaderComponent={() => (
          <View className="my-16 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="text-sm font-pmedium text-gray-100">
                  Your Bookmark videos
                </Text>
              </View>
              <View>
                <Image source={images.logoSmall} className="w-8 h-9" />
              </View>
            </View>
            <Search />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No Videos Found" subtitle="No Bookmarks" />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Bookmark;
