import React from "react";
import { YStack, Image, Spinner } from "tamagui";

const SplashScreen = () => {
  return (
    <YStack
      alignItems="center"
      justifyContent="center"
      h="100%"
      exitStyle={{
        scale: 1.5,
        y: -10,
        opacity: 20,
      }}
    >
      <Image
        src={require("../../assets/icons/logo_UNITBV2.png")}
        height={300}
        width={300}
        resizeMode="contain"
      />
      <Spinner size="large" color="black" />
    </YStack>
  );
};

export default SplashScreen;
