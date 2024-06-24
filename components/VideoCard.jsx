import { useEffect, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { icons } from "../constants";
import { bookmarkVideos, removeBookmark } from "../lib/appwrite";
import { useAuth } from "../context/authContext";
import Loader from "./Loader";
import { useBookmark } from "../context/bookmarkContext";

const VideoCard = ({ title, creator, avatar, thumbnail, video }) => {
  const [play, setPlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { bookmarks } = useBookmark();

  
  const [bookmark, setBookmark] = useState(
    bookmarks.some((item) => item.video === video)
  );

  useEffect(() => {
    async function createBookmark() {
      setLoading(true);
      try {
        if (bookmark) {
          await bookmarkVideos(
            user.$id,
            video,
            creator,
            thumbnail,
            avatar,
            title
          );
          console.log("Bookmarked!");
        } else {
          await removeBookmark(user.$id, video);
          console.log("Bookmark removed!");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }


    if (user) {
      createBookmark();
    }
  }, [bookmark]); 

  if (loading) {
    return <Loader isLoading={loading} />;
  }

  return (
    <View className="flex flex-col items-center px-4 mb-24">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-full  border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {creator}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="pt-2"
          onPress={() => setBookmark(!bookmark)}
        >
          {bookmark ? (
            <Image
              source={icons.bookmark1}
              className="w-5 h-5 mt-2 mr-1"
              resizeMode="contain"
            />
          ) : (
            <Image
              source={icons.bookhollow}
              className="w-6 h-8"
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </View>

      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
