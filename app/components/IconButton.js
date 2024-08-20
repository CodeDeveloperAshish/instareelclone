import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import Colors from "../utils/Colors";

const IconButton = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-gray-700 w-32 h-28 rounded-lg justify-center items-center"
    >
      <Image source={icon} className="w-7 h-7" tintColor={"#fff"} />
      <Text className=" mt-2 text-white font-semibold">{title}</Text>
    </TouchableOpacity>
  );
};

export default IconButton;
