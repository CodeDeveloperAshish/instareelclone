import { View, Text, ActivityIndicator } from "react-native";
import React from "react";

const Loader = ({ loading, title }) => {
  return (
    <View
      style={{ gap: 15 }}
      className="bg-gray-700 w-[60%] h-10 mt-10 rounded-lg justify-center items-center flex-row"
    >
      <Text className="text-white font-medium">{title}</Text>
      <ActivityIndicator animating={loading} />
    </View>
  );
};

export default Loader;
