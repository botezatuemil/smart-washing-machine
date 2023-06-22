import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { useState, useEffect, useRef } from "react";
import { Adapt, Select, Sheet, Text, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import EntypoIcon from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import {
  FormReservation,
  Item,
  SelectType,
} from "../../../screens/Wash/Reservations/Reservation.const";
import { UseFormClearErrors } from "react-hook-form";
import { View } from "react-native";

type SelectProps = {
  onChange: (newValue: string) => void;
  onOpen: (field: SelectType) => void;
  items: Item | undefined;
  placeholder: string;
  defaultValue?: Item | undefined;
  field: SelectType;
  clearErrors: UseFormClearErrors<FormReservation>;
  errors: boolean;
  errorMessage: string;
  showErrorBorder: boolean;
};

const SelectInput = ({
  placeholder,
  onChange,
  onOpen,
  items,
  defaultValue,
  field,
  clearErrors,
  errors,
  errorMessage,
  showErrorBorder
}: SelectProps) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    onChange(
      defaultValue?.values ? defaultValue.values[0].id.toString() : value
    );
  }, [defaultValue]);

  return (
    <Select
      value={defaultValue?.values ? defaultValue.values[0].name : value}
      onValueChange={(e: string) => {
        onChange(e), setValue(e);
        clearErrors(field);
      }}
      onOpenChange={() => {
        onOpen(field);
      }}
    >
      <Select.Trigger
        w="100%"
        iconAfter={<EntypoIcon name="chevron-small-down" size={25} />}
        borderColor={`${showErrorBorder  ? "#FF0000" : "#DFE1E9"}`}
      >
        <Select.Value placeholder={placeholder} />
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
            <Select.Label>{items?.title}</Select.Label>
            {!errors && items
              ? items.values?.map((item, i) => {
                  return (
                    <Select.Item
                      index={i}
                      key={item.name}
                      value={item.id.toString()}
                      w="100%"
                    >
                      <Select.ItemText>{item.name}</Select.ItemText>
                      <Select.ItemIndicator ml="auto">
                        <Feather name="check" size={20} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  );
                })
              : defaultValue &&
                !errors && (
                  <Select.Item
                    index={1}
                    key={defaultValue.values[0].id}
                    value={defaultValue.values[0].name}
                    w="100%"
                  >
                    <Select.ItemText>
                      {defaultValue.values[0].name}
                    </Select.ItemText>
                    <Select.ItemIndicator ml="auto">
                      <Feather name="check" size={20} />
                    </Select.ItemIndicator>
                  </Select.Item>
                )}
            {errors && (
              <Text
                alignSelf="center"
                fontFamily="InterSemi"
                fontSize={18}
              >
                {errorMessage}
              </Text>
            )}
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
};

export default SelectInput;
