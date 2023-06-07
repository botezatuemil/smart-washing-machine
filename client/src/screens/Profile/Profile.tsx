import { useState } from "react";
import { Button, XStack, YStack, Text, Stack } from "tamagui";
import * as styles from "./Profile.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLoginStore } from "../../store/LoginStore";
import { useGetProfile } from "../../api/profile/useGetProfile";
import { UserProfile } from "../../api/profile/endpoints";
import SwitchWithLabel from "../../components/common/SwitchWithLabel/SwitchWithLabel";

const labels = [
  "First Name",
  "Last Name",
  "Email",
  "Dorm number",
  "Floor",
  "Building",
  "Campus",
];

const Profile = () => {
  const { toggleLogin, token } = useLoginStore();
  const { data } = useGetProfile(token);
  const [active, setActive] = useState<boolean>(true);
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      toggleLogin(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <YStack
      display="flex"
      w="100%"
      h="100%"
      space={10}
      paddingTop={40}
      bg="white"
    >
      <YStack space={10} paddingHorizontal={40}>
        {data &&
          Object.keys(data).map((key, index) => (
            <XStack display="flex" justifyContent="space-between" w="100%">
              <Stack w="40%">
                <Text {...styles.label}>{labels[index]}:</Text>
              </Stack>
              <Stack w="100%">
                <Text {...styles.text}>{data[key as keyof UserProfile]}</Text>
              </Stack>
            </XStack>
          ))}
      </YStack>
        <Stack paddingHorizontal={40}>
          <SwitchWithLabel
            isActive={active}
            setIsActive={setActive}
            label="Notifications:"
            textProps={styles.label}
          />
        </Stack>
      <Stack
        position="absolute"
        bottom={0}
        marginBottom={10}
        w="100%"
        ai="center"
      >
        <Button {...styles.button} onPress={logout} w="80%">
          <Text color="white" fontFamily="InterSemi">
            Log out
          </Text>
        </Button>
      </Stack>
    </YStack>
  );
};

export default Profile;
