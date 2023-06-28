import { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { ScrollView, YStack, Text, XStack, Stack } from "tamagui";
import { useLoginStore } from "../../store/LoginStore";
import IconFeather from "react-native-vector-icons/Feather";
import { useGetNotifications } from "../../api/notifications/get/useGetNotifications";
import moment from "moment";
import { useDeleteNotification } from "../../api/notifications/delete/useDeleteNotification";
import { useQueryClient } from "react-query";
import { useIsFocused } from "@react-navigation/native";

const Inbox = () => {
  const { token } = useLoginStore();
  const { data, refetch } = useGetNotifications(token);
  const deleteNotification = useDeleteNotification();
  const isFocused = useIsFocused();

  useEffect(() => {
    refetch();
  }, [isFocused])

  const sortedData = data &&  data.sort((n1, n2) => {
    if (n1.timestamp < n2.timestamp) {
      return 1;
    } else if (n1.timestamp < n2.timestamp) {
      return -1;
    } else {
      if (n1.timestamp < n2.timestamp) {
        return 1;
      } else {
        return -1;
      }
    }
  });

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
      {sortedData && sortedData.length > 0 ? (
        data.map((notification) => (
          <Stack style={{ marginBottom: 10 }}>
            <XStack
              ai="center"
              jc="space-between"
              key={notification.id}
              bg="#F8F8F8"
              p={21}
              borderRadius={8}
            >
              <YStack>
                <Text fontFamily="InterSemi">{notification.title}</Text>
                <Text fontFamily="Inter" fontSize={12}>
                  {moment(notification.timestamp).format("llll")}
                </Text>
              </YStack>
              <TouchableOpacity
                onPress={() =>
                  deleteNotification.mutate({
                    notificationId: notification.id,
                    token,
                  })
                }
              >
                <IconFeather name="trash-2" size={20} />
              </TouchableOpacity>
            </XStack>
          </Stack>
        ))
      ) : (
        <Text textAlign="center" fontFamily="Inter" fontSize={16}>No notifications received</Text>
      )}
    </ScrollView>
  );
};

export default Inbox;
