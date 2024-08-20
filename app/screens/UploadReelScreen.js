import React, { useState, useRef, useCallback } from "react";
import { View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import IconButton from "../components/IconButton";
import { s3bucket } from "../utils/S3BucketConfig";
import Loader from "../components/Loader";
import { ToastMessage } from "../components/ToastMessage";
import { supabase } from "../utils/SupabaseConfig";
import { Video, ResizeMode } from "expo-av";

const UploadReelScreen = () => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reelPlayer, setReelPlayer] = useState(false);
  const videoRef = useRef(null);

  const reelPickerHandler = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0,
      });

      if (!result.canceled) {
        setReelPlayer(true);
        setVideo(result.assets[0].uri);
        videoRef.current?.playAsync();
      }
    } catch (error) {
      ToastMessage("error", "Error picking video", error.message);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setReelPlayer(false);
        setVideo(null);
        setLoading(false);
      };
    }, [])
  );

  const uploadReelHandler = useCallback(async () => {
    if (!video) {
      ToastMessage("error", "Please select a reel to upload");
      return;
    }
    setReelPlayer(false);
    setLoading(true);
    const fileType = video.split(".").pop();
    const params = {
      Bucket: "instareelclone",
      Key: `reel-${Date.now()}.mp4`,
      ACL: "public-read",
      Body: await fetch(video).then((resp) => resp.blob()),
      ContentType: `video/${fileType}`,
    };

    try {
      const resp = await s3bucket.upload(params).promise();
      const { data, error } = await supabase
        .from("videos")
        .insert([{ video_url: resp.Location }])
        .select();

      if (data) {
        ToastMessage(
          "success",
          "Reel Uploaded Successfully",
          "It is visible on the feed now"
        );
      } else {
        throw new Error(error.message);
      }
    } catch (error) {
      ToastMessage("error", "Upload Failed", error.message);
    } finally {
      setLoading(false);
      setVideo(null);
    }
  }, [video]);

  return (
    <View className="flex-1 bg-zinc-900 justify-center items-center">
      {reelPlayer && (
        <Video
          ref={videoRef}
          style={{ width: 250, height: 450 }}
          source={{ uri: video }}
          useNativeControls
          resizeMode={ResizeMode.COVER}
          isLooping
        />
      )}

      {loading ? (
        <Loader loading={loading} title={"Uploading Reel"} />
      ) : (
        <View
          style={{ gap: 20 }}
          className="flex-row justify-center w-full mt-5"
        >
          <IconButton
            title={video ? "Change Reel" : "Select Reel"}
            icon={require("../../assets/icons/selectreel.png")}
            onPress={reelPickerHandler}
          />

          <IconButton
            title="Upload Reel"
            icon={require("../../assets/icons/upload.png")}
            onPress={uploadReelHandler}
          />
        </View>
      )}
    </View>
  );
};

export default UploadReelScreen;
