import { View, Text, Image } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ReelsFeedScreen from "../screens/ReelsFeedScreen";
import UploadReelScreen from "../screens/UploadReelScreen";
import Colors from "../utils/Colors";

const Tab = createBottomTabNavigator();

const ScreenNavigatorStyle = {
  headerShown: false,
  tabBarStyle: { backgroundColor: "#27272a", borderTopWidth: 0 },
};

const RootNavigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={ScreenNavigatorStyle}>
        <Tab.Screen
          name="UploadReelScreen"
          component={UploadReelScreen}
          options={{
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  fontSize: 12,
                  color: focused == 1 ? "#fff" : "#949494",
                }}
              >
                Upload Reel
              </Text>
            ),
            tabBarIcon: ({ focused }) => (
              <Image
                tintColor={focused ? "#fff" : "#949494"}
                contentFit="contain"
                style={{ width: 18, height: 18 }}
                source={require("../../assets/icons/uploadreel.png")}
              />
            ),
          }}
        />
        <Tab.Screen
          name="ReelsFeedScreen"
          component={ReelsFeedScreen}
          options={{
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  fontSize: 12,
                  color: focused == 1 ? "#fff" : "#949494",
                }}
              >
                Reels
              </Text>
            ),
            tabBarIcon: ({ focused }) => (
              <Image
                tintColor={focused ? "#fff" : "#949494"}
                contentFit="contain"
                style={{ width: 18, height: 18 }}
                source={require("../../assets/icons/reels.png")}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
