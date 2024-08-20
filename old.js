import { View, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import IconButton from "../components/IconButton";
import * as ImagePicker from "expo-image-picker";
import { useVideoPlayer, VideoView } from "expo-video";
import { useFocusEffect } from "@react-navigation/native";
const UploadReelScreen = () => {
  const [reel, setReel] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const playerRef = useRef(null);

  const reelPickerHandler = async () => {
    if (playerRef.current) {
      player.pause();
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [1, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setReel(result.assets[0].uri);
    }
  };

  const player = useVideoPlayer(reel, (player) => {
    player.loop = true;
    player.play();
  });

  useEffect(() => {
    const subscription = player.addListener("playingChange", (playing) => {
      setIsPlaying(playing);
    });

    return () => {
      // Clean up when the component unmounts
      if (player && isPlaying) {
        player.pause();
      }
      subscription.remove();
    };
  }, [player]);

  const togglePlayback = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        // Pause the video when the screen loses focus
        player.pause();
      };
    }, [player, isPlaying])
  );
  return (
    <View className="flex-1 bg-zinc-900 justify-center items-center">
      {reel && (
        <TouchableOpacity onPress={togglePlayback}>
          <VideoView
            ref={playerRef}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            nativeControls={false}
            player={player}
            style={{
              width: 250,
              height: 450,
              borderRadius: 10,
            }}
          />
        </TouchableOpacity>
      )}

      <View style={{ gap: 20 }} className="flex-row justify-center w-full mt-5">
        <IconButton
          title={reel ? "Change Reel" : "Select Reel"}
          icon={require("../../assets/icons/selectreel.png")}
          onPress={reelPickerHandler}
        />
        <IconButton
          title={"Upload Reel"}
          icon={require("../../assets/icons/upload.png")}
          onPress={reelPickerHandler}
        />
      </View>
    </View>
  );
};

export default UploadReelScreen;
