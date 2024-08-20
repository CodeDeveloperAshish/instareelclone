import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

const PostAction = ({
  Icon,
  count,
  onPress,
  VideoId,
  likeStatus,
  tintColor,
}) => {
  return (
    <View className="items-center mb-5">
      <TouchableOpacity onPress={() => onPress(VideoId, likeStatus)}>
        <Image
          tintColor={tintColor ? tintColor : "#fff"}
          source={Icon}
          className="w-7 h-7"
        />
      </TouchableOpacity>
      <Text className="text-white font-bold mt-1">{count}</Text>
    </View>
  );
};

export default PostAction;
