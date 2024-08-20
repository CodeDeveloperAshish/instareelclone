import { View, Text, Dimensions, Image, StyleSheet, Alert } from "react-native";
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Video, ResizeMode } from "expo-av";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useIsFocused } from "@react-navigation/native";
import * as Sharing from "expo-sharing";
import PostAction from "./PostAction";
import CommentModal from "./CommentModal";

const PlayVideo = ({ video, index, activeVideoIndex, reelLikeHandler }) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const BottomTabHeight = useBottomTabBarHeight();
  const screenHeight = Dimensions.get("window").height - BottomTabHeight;
  const isFocused = useIsFocused();

  const videoUri = useMemo(() => video?.video_url, [video?.video_url]);

  const handleVideoPlayback = useCallback(() => {
    if (isFocused && index === activeVideoIndex) {
      videoRef.current?.setPositionAsync(0);
      videoRef.current?.playAsync();
    } else {
      videoRef.current?.pauseAsync();
    }
  }, [isFocused, index, activeVideoIndex]);

  useEffect(() => {
    handleVideoPlayback();
  }, [handleVideoPlayback]);

  const shareReel = useCallback(async () => {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Sharing is not available on this device");
        return;
      }
      await Sharing.shareAsync(videoUri);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }, [videoUri]);

  return (
    <>
      <CommentModal
        comments={video.comments}
        commentModalVisible={commentModalVisible}
        setCommentModalVisible={setCommentModalVisible}
        videoId={video.id}
      />
      <View
        style={{ zIndex: 1, gap: 10 }}
        className="absolute bottom-3 left-3 flex-row items-center"
      >
        <Image
          source={require("../../assets/icons/user.png")}
          className="w-8 h-8"
        />
        <View>
          <Text className="font-bold text-white">Asish Gupta</Text>
          <Text className="text-xs text-white">
            Reels Clone Developed By Ashish
          </Text>
        </View>
      </View>

      <View className="absolute right-5 bottom-10">
        <PostAction
          Icon={
            video?.like_status
              ? require("../../assets/icons/heartfilled.png")
              : require("../../assets/icons/heart.png")
          }
          tintColor={video?.like_status && "red"}
          count={video?.like_status ? 1 : 0}
          VideoId={video.id}
          likeStatus={video?.like_status}
          onPress={reelLikeHandler}
        />
        <PostAction
          Icon={require("../../assets/icons/comment.png")}
          onPress={() => setCommentModalVisible(true)}
        />
        <PostAction
          Icon={require("../../assets/icons/share.png")}
          onPress={shareReel}
          videoLink={videoUri}
        />
      </View>

      <Video
        ref={videoRef}
        style={[styles.videoStyle, { height: screenHeight }]}
        source={{
          uri: videoUri,
        }}
        shouldPlay
        useNativeControls={false}
        resizeMode={ResizeMode.COVER}
        isLooping
        onPlaybackStatusUpdate={setStatus}
      />
    </>
  );
};

const styles = StyleSheet.create({
  videoStyle: {
    width: Dimensions.get("window").width,
    alignSelf: "center",
    zIndex: -10,
  },
});

export default PlayVideo;
