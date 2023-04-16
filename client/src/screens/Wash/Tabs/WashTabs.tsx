import { useRef, useState } from "react";
import {
  AnimatePresence,
  H5,
  SizableText,
  Stack,
  TabTriggerLayout,
  Tabs,
  TabsTriggerProps,
  YStack,
  styled,
  Text,
} from "tamagui";

import { Animated } from "react-native";

import * as styles from "./WashTabs.styles";
import Reservations from "../Reservations/Reservations";
import UserWash from "../UserWash/UserWash";
import History from "../History/History";

export const Wash = () => {
  const [currentTab, setCurrentTab] = useState("tab1");

  // Layout of the trigger user might intend to select (hovering / focusing)
  const [IntentIndicator, setIntentIndicator] =
    useState<TabTriggerLayout | null>(null);
  const [activeColor, setActiveColor] = useState({
    new: "#8C90A2",
    processing: "#8C90A2",
    history: "#8C90A2",
  });

  // Layout of the trigger user selected
  const [selectIndicator, setSelectIndicator] =
    useState<TabTriggerLayout | null>(null);
  const prevSelectionIndicatorLayout = useRef<TabTriggerLayout | null>(null);

  const handleUpdateSelectionIndicator = (newSize: TabTriggerLayout | null) => {
    prevSelectionIndicatorLayout.current = selectIndicator;
    setSelectIndicator(newSize);

    if (currentTab === "tab1") {
      setActiveColor({
        new: "#0055EE",
        processing: "#8C90A2",
        history: "#8C90A2",
      });
    } else if (currentTab === "tab2") {
      setActiveColor({
        new: "#8C90A2",
        processing: "#0055EE",
        history: "#8C90A2",
      });
    } else {
      setActiveColor({
        new: "#8C90A2",
        processing: "#8C90A2",
        history: "#0055EE",
      });
    }
  };

  /**
   * -1: from left
   *  0: n/a
   *  1: from right
   */
  const direction = (() => {
    if (
      !selectIndicator ||
      !prevSelectionIndicatorLayout.current ||
      selectIndicator.x === prevSelectionIndicatorLayout.current.x
    ) {
      return 0;
    }
    return selectIndicator.x > prevSelectionIndicatorLayout.current.x ? -1 : 1;
  })();

  const enterVariant =
    direction === 1 ? "isLeft" : direction === -1 ? "isRight" : "defaultFade";
  const exitVariant =
    direction === 1 ? "isRight" : direction === -1 ? "isLeft" : "defaultFade";

  const handleOnInteraction: TabsTriggerProps["onInteraction"] = (
    type,
    layout
  ) => {
    if (type === "select") {
      handleUpdateSelectionIndicator(layout);
    } else {
      setIntentIndicator(layout);
    }
  };

  const renderByTab = () => {
    switch (currentTab) {
      case "tab1":
        return <Reservations />;
      case "tab2":
        return <UserWash />;
      default:
        return <History />;
    }
  };

  return (
    <Tabs
      value={currentTab}
      onValueChange={setCurrentTab}
      orientation="horizontal"
      w="100%"
      flexDirection="column"
      activationMode="manual"
      h="100%"
    >
      <YStack borderColor="$color3" borderBottomWidth="$0.5">
        <Tabs.List
          loop={false}
          aria-label="Manage your account"
          disablePassBorderRadius
          overflow="visible"
          justifyContent="space-between"
          px={20}
          bg="#F8F8F8"
          paddingTop={35}

          // pb="$1.5"
        >
          {IntentIndicator && (
            <TabsRovingIndicator
              width={IntentIndicator.width}
              height={IntentIndicator.height}
              x={IntentIndicator.x}
              y={IntentIndicator.y}
            />
          )}

          {selectIndicator && (
            <TabsRovingIndicator
              // theme="active"
              // theme="blue"
              active
              width={selectIndicator.width}
              height={3}
              x={selectIndicator.x}
              borderRadius={100}
              bottom={-3}
            />
          )}

          <Tabs.Trigger value="tab1" onInteraction={handleOnInteraction}>
            <SizableText {...styles.tabText} color={activeColor.new}>
              Reserve
            </SizableText>
          </Tabs.Trigger>
          <Tabs.Trigger value="tab2" onInteraction={handleOnInteraction}>
            <SizableText {...styles.tabText} color={activeColor.processing}>
              Processing
            </SizableText>
          </Tabs.Trigger>
          <Tabs.Trigger value="tab3" onInteraction={handleOnInteraction}>
            <SizableText {...styles.tabText} color={activeColor.history}>
              History
            </SizableText>
          </Tabs.Trigger>
        </Tabs.List>
      </YStack>

      <AnimatePresence
        exitBeforeEnter
        enterVariant={enterVariant}
        exitVariant={exitVariant}
      >
        <AnimatedYStack key={currentTab} x={0} o={1} f={1} animation="quick">
          <Tabs.Content value={currentTab} forceMount f={1} >
            {renderByTab()}
          </Tabs.Content>
        </AnimatedYStack>
      </AnimatePresence>
    </Tabs>
  );
};

const TabsRovingIndicator = styled(Stack, {
  position: "absolute",
  backgroundColor: "$color5",
  opacity: 1,
  animation: "quick",
  borderRadius: "$4",

  variants: {
    active: {
      true: {
        backgroundColor: "#2c70ee",
      },
    },
  },
});

const AnimatedYStack = styled(YStack, {
  variants: {
    isLeft: { true: { x: -25, opacity: 0 } },
    isRight: { true: { x: 25, opacity: 0 } },
    defaultFade: { true: { opacity: 0 } },
  } as const,
});
