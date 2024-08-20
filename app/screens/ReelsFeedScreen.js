import { View, FlatList } from "react-native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import PlayVideo from "../components/PlayVideo";
import { supabase } from "../utils/SupabaseConfig";
import { useIsFocused } from "@react-navigation/native";
import Loader from "../components/Loader";

const ReelsFeedScreen = () => {
  const isFocused = useIsFocused();
  const [reels, setReels] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 80 });

  const getReelsAndComments = useCallback(async () => {
    try {
      setLoading(true);
      const [
        { data: videos, error: videosError },
        { data: comments, error: commentsError },
      ] = await Promise.all([
        supabase
          .from("videos")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("comments").select("*"),
      ]);

      if (videosError) throw videosError;
      if (commentsError) throw commentsError;

      const reelsWithComments = videos.map((video) => ({
        ...video,
        comments:
          comments.filter((comment) => comment.video_id === video.id) || [],
      }));

      setReels(reelsWithComments);
    } catch (error) {
      console.error("Error fetching reels or comments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      getReelsAndComments();
    }
  }, [isFocused, getReelsAndComments]);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentVideoIndex(viewableItems[0].index);
    }
  }, []);

  const reelLikeHandler = useCallback(async (videoID, currentLikeStatus) => {
    const newLikeStatus = !currentLikeStatus;

    try {
      const { error } = await supabase
        .from("videos")
        .update({ like_status: newLikeStatus })
        .eq("id", videoID);

      if (error) throw error;

      setReels((prevReels) =>
        prevReels.map((reel) =>
          reel.id === videoID ? { ...reel, like_status: newLikeStatus } : reel
        )
      );
    } catch (error) {
      console.error("Error handling reel like:", error.message);
    }
  }, []);

  return (
    <View className="flex-1 h-full">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Loader loading={loading} title={"Please Wait..."} />
        </View>
      ) : (
        <FlatList
          data={reels}
          renderItem={({ item, index }) => (
            <PlayVideo
              video={item}
              activeVideoIndex={currentVideoIndex}
              index={index}
              reelLikeHandler={reelLikeHandler}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          pagingEnabled
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig.current}
          showsVerticalScrollIndicator={false}
          disableIntervalMomentum
          initialNumToRender={1}
          onEndReachedThreshold={0.1}
          decelerationRate="normal"
        />
      )}
    </View>
  );
};

export default ReelsFeedScreen;
