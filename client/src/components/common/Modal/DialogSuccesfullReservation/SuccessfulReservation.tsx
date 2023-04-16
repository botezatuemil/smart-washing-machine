import ModalOverlay from "../ModalLayout/ModalOverlay";
import { Text, YStack } from "tamagui";
import SwitchWithLabel from "../../SwitchWithLabel/SwitchWithLabel";
import { LaundryType, ReservationRequestType } from "../../../../screens/Wash/Reservations/Reservation.const";
import { useState } from "react";
import { useReservation } from "../../../../api/reservation/makeReservation/useReservation";
import { HourInterval, ReservationType } from "../../../../interfaces";
import { WashingDevice } from "../../../../api/washingDevice/getDevicesSelect/types";
import moment from "moment";
import { useUserStore } from "../../../../store/UserStore";

type SuccessReservationProp = {
  isOpen: boolean;
  closeModal: () => void;
  onCancel: () => void;
  data : ReservationRequestType | undefined
};

const SuccessfulReservation = ({
  isOpen,
  closeModal,
  onCancel,
  data
}: SuccessReservationProp) => {


  const onSuccess = (data : ReservationType) => {
    console.log(data)
  }

  const addReservation = useReservation(onSuccess);
  const [isActive, setIsActive] = useState<boolean>(false);

  
  const {id} = useUserStore();

 

  const onMakeReservation = () => {
    // get needed reservation data from the data
    const laundry = data?.laundry as unknown as LaundryType;
    const device = data?.washingMachine as unknown as WashingDevice;
    const date = data?.date as Date;
    const interval = data?.time

    //split by start hour and end hour
    const hours =  interval!.split("-");
    console.log(moment(date).utc().set({h: parseInt(hours[0].split(":")[0]), m: parseInt(hours[0].split(":")[1])}),)

    // convert start hour and end hour back to moment type
   
    const reservation : Omit<ReservationType, "id"> = {
      studentId: id,
      laundryId: laundry.id,
      reservationDate: moment(date),
      scheduledEarly: isActive,
      washingDeviceId: device.id,
      startHour: moment(date).utc().set({h: parseInt(hours[0].split(":")[0]), m: parseInt(hours[0].split(":")[1])}),
      endHour : moment(date).utc().set({h: parseInt(hours[1].split(":")[0]), m: parseInt(hours[1].split(":")[1])}),
    }
    addReservation.mutate(reservation)
    closeModal();
  }

  return (
    <ModalOverlay
      isOpen={isOpen}
      closeModal={closeModal}
      title={"Are you sure?"}
      onSave={onMakeReservation}
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
      <SwitchWithLabel isActive={isActive} setIsActive={setIsActive}/>
      </YStack>
    </ModalOverlay>
  );
};

export default SuccessfulReservation;
