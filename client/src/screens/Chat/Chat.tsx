import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState, useRef } from "react";
import {
  NativeSyntheticEvent,
  TextInputChangeEventData,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Input, Text, XStack, YStack } from "tamagui";

import { Message } from "../../api/chat/messages/messages.const";
import { useMessages } from "../../api/chat/messages/useMessages";
import { useChatStore } from "../../store/ChatStore";
import { useLoginStore } from "../../store/LoginStore";
import { useUserStore } from "../../store/UserStore";
import { ChatStackParams } from "./ChatNavigator";

import EntypoIcon from "react-native-vector-icons/Entypo";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import io from "socket.io-client";
import { PORT, IP } from "@env";
type Props = NativeStackScreenProps<ChatStackParams, "Chat">;
const socket = io(`http://${IP}:${PORT}`);


const Chat = ({ route }: Props) => {

  const [showFullInput, setShowFullInput] = useState<boolean>(true);
  const scrollViewRef = useRef<ScrollView>(null);

  const { id } = useUserStore();
  const { token } = useLoginStore();
  const { data, refetch } = useMessages({
    conversationId: route.params.conversationId,
    token: token,
  });

  const [message, setMessage] = useState<string>("");

  const { chats, addMessage } = useChatStore();

  const messages =
    chats.filter(
      (chat) => chat.conversation.id === route.params.conversationId
    )[0].messages ?? [];

  const onSendMessage = () => {
    const messagePayload: Omit<Message, "id"> = {
      conversationId: route.params.conversationId,
      message: message,
      senderId: id as number,
      timestamp: moment().utc(),
    };

    socket.emit("send message", JSON.stringify(messagePayload));
    setMessage("");
  };

  const onChangeHandler = (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    setMessage(e.nativeEvent.text);
  
  };

  const ChatMessage = (message: Message) => {
    return (
      <XStack
        alignSelf={`${message.senderId === id ? "flex-end" : "flex-start"}`}
        backgroundColor={`${message.senderId === id ? "#0055EE" : "#f5f6fa"}`}
        borderBottomRightRadius={parseInt(
          `${message.senderId === id ? 16 : 26}`
        )}
        borderTopRightRadius={parseInt(`${message.senderId === id ? 0 : 26}`)}
        borderBottomLeftRadius={parseInt(
          `${message.senderId === id ? 26 : 16}`
        )}
        borderTopLeftRadius={parseInt(`${message.senderId !== id ? 0 : 26}`)}
        maxWidth="60%"
        flexGrow={1}
      >
        <Text
          fontFamily="InterSemi"
          color={`${message.senderId === id ? "white" : "black"}`}
          paddingHorizontal={14}
          paddingVertical={10}
        >
          {message.message}
        </Text>
      </XStack>
    );
  };

  useEffect(() => {
    refetch();
    socket.on("new message", (message: string) => {
      const parsedMessage = JSON.parse(message) as Message;
      addMessage(parsedMessage);
    });

    return () => {
      socket.off("new message");
    };
  }, []);

  return (
    <YStack bg="white" h="100%" w="100%">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef?.current?.scrollToEnd({ animated: true })
        }
      >
        <YStack marginBottom={100}>
          {data &&
            messages.map((message) => (
              <YStack marginTop={2}>{ChatMessage(message)}</YStack>
            ))}
        </YStack>
      </ScrollView>
      <XStack
        w="100%"
        position="absolute"
        bottom={0}
        paddingHorizontal={16}
        alignItems="center"
        justifyContent="space-between"
        bg="white"
        paddingVertical={24}
        
      >
        <Input
          w={`${!showFullInput ? "100%" : "75%"}`}
          borderRadius={100}
          placeholder="Type something..."
          placeholderTextColor="#A0A7AE"
          fontFamily="InterMedium"
          bg="#F8F8F8"
          value={message}
          onChange={onChangeHandler}
          onSubmitEditing={onSendMessage}
          onFocus={() => {setShowFullInput(false); scrollViewRef?.current?.scrollToEnd({ animated: true })}}
          onBlur={() => setShowFullInput(true)}
        />
        {showFullInput && (
          <>
            <TouchableOpacity>
              <EntypoIcon size={20} name="emoji-happy" color="#9a9ca1" />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesomeIcon size={20} name="photo" color="#9a9ca1" />
            </TouchableOpacity>
            <TouchableOpacity>
              <EntypoIcon size={20} name="attachment" color="#9a9ca1" />
            </TouchableOpacity>
          </>
        )}
      </XStack>
    </YStack>
  );
};

export default Chat;
