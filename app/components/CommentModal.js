import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ToastMessage } from "./ToastMessage";
import { supabase } from "../utils/SupabaseConfig";

const CommentModal = ({
  commentModalVisible,
  setCommentModalVisible,
  comments,
  videoId,
}) => {
  const [commentText, setCommentText] = useState("");

  const GenerateUniqueID = useCallback(() => {
    return Math.floor(Math.random() * Date.now()).toString();
  }, []);

  const memoizedComments = useMemo(() => comments, [comments]);

  const addCommentHandler = useCallback(async () => {
    if (commentText.trim() === "") {
      ToastMessage("error", "Please write a comment first");
      return;
    }

    const comment = {
      id: GenerateUniqueID(),
      name: "Ashish Gupta",
      comment: commentText,
      video_id: videoId,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("comments").insert([comment]);

    if (error) {
      console.log(error);
      ToastMessage("error", "Failed to add comment");
      return;
    }

    comments.push(comment);
    setCommentText("");
    ToastMessage("success", "Comment added successfully");
  }, [commentText, GenerateUniqueID, videoId, comments]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={commentModalVisible}
      onRequestClose={() => setCommentModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setCommentModalVisible(false)}>
        <View
          style={{
            height: "80%",
            marginTop: "auto",
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={160}
          >
            <View className="bg-white flex-1 rounded-t-2xl px-5">
              <TouchableOpacity
                onPress={() => setCommentModalVisible(false)}
                className="h-1 bg-gray-300 w-20 self-center rounded-3xl my-4"
              ></TouchableOpacity>

              <FlatList
                data={memoizedComments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View
                    style={{ zIndex: 1, gap: 10 }}
                    className="flex-row items-center mt-5"
                  >
                    <Image
                      source={require("../../assets/icons/user.png")}
                      className="w-8 h-8"
                    />
                    <View>
                      <Text className="font-bold text-black">{item.name}</Text>
                      <Text className="text-xs text-black">{item.comment}</Text>
                    </View>
                  </View>
                )}
              />

              <View style={{ gap: 10 }} className="flex-row mb-6">
                <TextInput
                  keyboardType="default"
                  placeholder="Write a comment..."
                  placeholderTextColor="#4b5563"
                  style={{
                    paddingHorizontal: 20,
                    backgroundColor: "#d1d5db",
                    height: 50,
                    color: "black",
                    borderRadius: 10,
                    width: "80%",
                  }}
                  onChangeText={setCommentText}
                  value={commentText}
                />
                <TouchableOpacity
                  onPress={addCommentHandler}
                  className="bg-gray-500 justify-center items-center w-[15%] rounded-md"
                >
                  <Image
                    source={require("../../assets/icons/share.png")}
                    tintColor={"#fff"}
                    className="w-6 h-6"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CommentModal;
