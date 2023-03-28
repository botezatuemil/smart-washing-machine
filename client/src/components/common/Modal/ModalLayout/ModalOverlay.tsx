import Modal from "react-native-modal";
import { Button, YStack, Text, XStack, Stack, Separator } from "tamagui";
import AntIcon from "react-native-vector-icons/AntDesign";
import * as styles from "./ModalOverlay.styles";

type ModalOverlayProp = {
  isOpen: boolean;
  children: JSX.Element;
  closeModal: () => void;
  title: string;
  saveTitle: string;
  cancelTitle: string;
  onSave: () => void;
  onCancel: () => void;
};
const ModalOverlay = ({
  isOpen,
  closeModal,
  title,
  children,
  saveTitle,
  cancelTitle,
  onSave,
  onCancel,
}: ModalOverlayProp) => {
  return (
    <Stack>
      <Modal isVisible={isOpen}>
        <YStack bg="white" borderRadius={12} padding={20}>
          <XStack alignItems="center" justifyContent="space-between">
            <Text {...styles.text}>{title}</Text>
            <AntIcon name="close" size={20} onPress={closeModal} />
          </XStack>
          {children}
          <YStack marginTop={20}>
            <Separator/>
          <XStack alignSelf="flex-end" marginTop={20} space={10}>
            <Button fontFamily="InterSemi" w={100} onPress={onCancel}>{cancelTitle}</Button>
            <Button fontFamily="InterSemi" backgroundColor="#0055EE" color="white" w={100} onPress={onSave}>{saveTitle}</Button>
          </XStack>
          </YStack>
        </YStack>
      </Modal>
    </Stack>
  );
};

export default ModalOverlay;
