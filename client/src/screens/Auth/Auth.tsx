import React from "react";
import {
  YStack,
  Text,
  Button,
  Stack,
  Image,
  Input,
  Form,
  ScrollView,
  XStack,
} from "tamagui";
import * as styles from "./Auth.styles";
import { useForm, Controller } from "react-hook-form";
import { FormLogin, LoginRequestType } from "./Auth.const";
import { TouchableOpacity } from "react-native";
import { useLogin } from "../../api/login/useLogin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { useLoginStore } from "../../store/LoginStore";


const Auth = ({ navigation }: any) => {

  const {toggleLogin} = useLoginStore();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormLogin>();

  const onError = (error: unknown) => {
    const message = (error as { message?: string }).message;
    Toast.show({
      type: "error",
      text1: message,
    });
  };

  const onSuccess = async (data: string) => {
    try {
      await AsyncStorage.setItem("token", data);
      toggleLogin(true);
      navigation.navigate("Tabs");
    } catch (error) {
      console.log(error);
    }
  };

  const login = useLogin(onSuccess, onError);

  const LoginForm = () => {
    const onSubmit = (data: FormLogin) => {
      const userData: LoginRequestType = {
        email: data.email,
        password: data.password,
      };
      login.mutate(userData);
    };

    return (
      <Form
        w="100%"
        h="100%"
        paddingHorizontal={32}
        onSubmit={handleSubmit((data) => onSubmit(data))}
      >
        <Stack space={16} mt={65}>
          <YStack flexGrow={1}>
            <Text {...styles.text}>University email address</Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  fontFamily="InterSemi"
                  borderColor={`${errors.email ? "#FF0000" : "#DFE1E9"}`}
                  selectionColor="#A0A7AE"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  focusStyle={
                    errors.email && { borderColor: "#FF0000", borderWidth: 2 }
                  }
                />
              )}
              name="email"
            />
            {errors.email && (
              <Text {...styles.text} color="#FF0000" fontSize={10} mt={8}>
                Please enter an email address
              </Text>
            )}
          </YStack>

          <YStack flexGrow={1}>
            <Text {...styles.text}>Password</Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  fontFamily="InterSemi"
                  borderColor={`${errors.password ? "#FF0000" : "#DFE1E9"}`}
                  selectionColor="#A0A7AE"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={true}
                  focusStyle={
                    errors.password && {
                      borderColor: "#FF0000",
                      borderWidth: 2,
                    }
                  }
                />
              )}
              name="password"
            />
            <XStack width="100%">
              {errors.password && (
                <Text {...styles.text} color="#FF0000" fontSize={10} mt={8}>
                  Please enter the password
                </Text>
              )}
              <TouchableOpacity style={{ marginLeft: "auto", marginTop: 8 }}>
                <Text {...styles.text} fontSize={10}>
                  Forgot your password?
                </Text>
              </TouchableOpacity>
            </XStack>
          </YStack>
        </Stack>

        <Form.Trigger asChild mt={65}>
          <Button backgroundColor="#0055EE">
            <Text {...styles.text} color="white">
              Sign In
            </Text>
          </Button>
        </Form.Trigger>
      </Form>
    );
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} backgroundColor="white">
      <Stack alignItems="center">
        <Image
          src={require("../../assets/icons/logo_UNITBV2.png")}
          height={300}
          width={300}
          resizeMode="contain"
        />
        <YStack w="100%" paddingHorizontal={32}>
          <Text fontFamily="InterBold" fontSize={32}>
            Get Started
          </Text>
          <Text {...styles.text}>
            Wash your clothes using our smart machines!
          </Text>
        </YStack>
        <Toast />
        {LoginForm()}
      </Stack>
    </ScrollView>
  );
};

export default Auth;
