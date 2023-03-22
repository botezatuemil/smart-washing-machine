import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { useState } from "react";
import { Adapt, Select, Sheet, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import EntypoIcon from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import * as styles from "./SelectInput.styles"


type SelectProps = {
  value : string,
  onChange: (newValue : string) => void
  onOpen: () => void
}

const SelectInput = ({onChange, value, onOpen} : SelectProps) => {

  return (
    <Select id="food" value={value} onValueChange={onChange} onOpenChange={onOpen}>
      <Select.Trigger
        w="100%"
        iconAfter={<EntypoIcon name="chevron-small-down" size={25} />}
        
      >
        <Select.Value placeholder="Something" />
      </Select.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet modal dismissOnSnapToBottom>
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={20}>
        <Select.ScrollUpButton
          ai="center"
          jc="center"
          pos="relative"
          w="100%"
          h="$3"
        >
          <YStack zi={10}>
            <EntypoIcon name="chevron-up" size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={["$background", "$backgroundTransparent"]}
            br="$4"
          />
        </Select.ScrollUpButton>

        <Select.Viewport minWidth={200}>
          <Select.Group space="$0">
            <Select.Label>Fruits</Select.Label>
            {items.map((item, i) => {
              return (
                <Select.Item
                  index={i}
                  key={item.name}
                  value={item.name.toLowerCase()}
                  w="100%"
                >
                  <Select.ItemText>{item.name}</Select.ItemText>
                  <Select.ItemIndicator ml="auto">
                    <Feather name="check" size={20} />
                  </Select.ItemIndicator>
                </Select.Item>
              );
            })}
          </Select.Group>
        </Select.Viewport>

        <Select.ScrollDownButton
          ai="center"
          jc="center"
          pos="relative"
          w="100%"
          h="$3"
        >
          <YStack zi={10}>
            <EntypoIcon name="chevron-down-thin" size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={["$backgroundTransparent", "$background"]}
            br="$4"
          />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  );
}

export default SelectInput;

const items = [
  { name: "Apple" },
  { name: "Pear" },
  { name: "Blackberry" },
  { name: "Peach" },
  { name: "Apricot" },
  { name: "Melon" },
  { name: "Honeydew" },
  { name: "Starfruit" },
  { name: "Blueberry" },
  { name: "Rasberry" },
  { name: "Strawberry" },
  { name: "Mango" },
  { name: "Pineapple" },
  { name: "Lime" },
  { name: "Lemon" },
  { name: "Coconut" },
  { name: "Guava" },
  { name: "Papaya" },
  { name: "Orange" },
  { name: "Grape" },
  { name: "Jackfruit" },
  { name: "Durian" },
];
