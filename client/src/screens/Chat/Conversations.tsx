import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { ScrollView, YStack, Text, XStack } from "tamagui";
import { useConversations } from "../../api/chat/conversations/useConversations";
import { useLoginStore } from "../../store/LoginStore";
import IconFeather from "react-native-vector-icons/Feather";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ChatStackParams } from "./ChatNavigator";
import { useChatStore } from "../../store/ChatStore";

const Conversations = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ChatStackParams>>();
  const { token } = useLoginStore();
  const { data } = useConversations(token);

  const openConversation = (id: number) => {
    const currentConversation = data?.filter(
      (conversation) => conversation.id === id
    )[0];
    navigation.navigate("Chat", {
      conversationId: id,
      title:
        currentConversation?.lastName + " " + currentConversation?.firstName,
    });
  };
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 100 }}
      w="100%"
      h="100%"
      px={25}
      py={40}
      space={20}
      bg="white"
    >
      {data &&
        data.map((conversation) => (
          <TouchableOpacity
            style={{ marginBottom: 10 }}
            onPress={() => openConversation(conversation.id)}
          >
            <XStack
              ai="center"
              jc="space-between"
              key={conversation.id}
              bg="#F8F8F8"
              p={21}
              borderRadius={8}
            >
              <YStack>
                <Text fontFamily="InterSemi">
                  {conversation.lastName} {conversation.firstName}
                </Text>
                <Text fontFamily="Inter">
                  {conversation.dormNumber} / floor {conversation.dormFloor}
                </Text>
              </YStack>
              <IconFeather name="send" size={20} />
            </XStack>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
};

export default Conversations;
