import ModalOverlay from "../ModalLayout/ModalOverlay";
import { Text, YStack } from "tamagui";
import SwitchWithLabel from "../../SwitchWithLabel/SwitchWithLabel";

type SuccessReservationProp = {
  isOpen: boolean;
  closeModal: () => void;
  onSave: () => void;
  onCancel: () => void;
};

const SuccessfulReservation = ({
  isOpen,
  closeModal,
  onSave,
  onCancel
}: SuccessReservationProp) => {
  return (
    <ModalOverlay
      isOpen={isOpen}
      closeModal={closeModal}
      title={"Are you sure?"}
      onSave={onSave}
      onCancel={onCancel}
      saveTitle={"Save"}
      cancelTitle={"Cancel"}
    >
      <YStack paddingTop={20} >
      <Text fontFamily="Inter" >
        To ensure the validity of a reservation, it is essential to scan the NFC
        when the designated time period begins. Failure to validate within the
        first 5 minutes of the reservation will result in automatic cancellation.
      </Text>
      <SwitchWithLabel/>
      </YStack>
    </ModalOverlay>
  );
};

export default SuccessfulReservation;
