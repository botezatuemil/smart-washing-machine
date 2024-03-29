import ModalOverlay from "../ModalLayout/ModalOverlay";
import { Text, YStack } from "tamagui";
import SwitchWithLabel from "../../SwitchWithLabel/SwitchWithLabel";
import { FormReservation, ReservationRequestType } from "../../../../screens/Wash/Reservations/Reservation.const";
import { useState } from "react";
import { useReservation } from "../../../../api/reservation/makeReservation/useReservation";
import { ReservationType } from "../../../../interfaces";
import moment from "moment";
import { useUserStore } from "../../../../store/UserStore";
import { ReservationStore, useReservationStore } from "../../../../store/ReservationStore";
import { useQueryClient } from "react-query";
import {  UseFormSetValue } from "react-hook-form";

type SuccessReservationProp = {
  isOpen: boolean;
  closeModal: () => void;
  onCancel: () => void;
  data : ReservationRequestType | undefined;
  setValue: UseFormSetValue<FormReservation>;
};

const SuccessfulReservation = ({
  isOpen,
  closeModal,
  onCancel,
  data,
  setValue
}: SuccessReservationProp) => {

  const { addReservationStore } = useReservationStore();

  const onSuccess = (data : ReservationStore) => {
    addReservationStore(data)
  }

  const addReservation = useReservation(onSuccess);
  const [isActive, setIsActive] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const {id} = useUserStore();
 

  const onMakeReservation = async() => {
    if (!data) {
      return;
    }
    
    const laundryId = parseInt(data.laundry);
    const washingDeviceId = parseInt(data.washingMachine);
    const date = data.date;
    const interval = data.time
    const hours = interval!.split("-");
    
    // convert start hour and end hour back to moment type
    const reservation : Omit<ReservationType, "id"> = {
      studentId: id,
      laundryId: laundryId,
      reservationDate: moment(date),
      scheduledEarly: isActive,
      washingDeviceId: washingDeviceId,
      startHour: moment(date).utc().set({h: parseInt(hours[0].split(":")[0]), m: parseInt(hours[0].split(":")[1])}),
      endHour : moment(date).utc().set({h: parseInt(hours[1].split(":")[0]), m: parseInt(hours[1].split(":")[1])}),
    }
    addReservation.mutate(reservation);
    await queryClient.invalidateQueries("incomingReservation");
    setValue("timeSlot", "");
    setValue("time", "");
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
        To ensure the validity of a reservation, it is essential to scan the QR code
        when the designated time period begins. Failure to validate within the
        first 10 minutes of the reservation will result in automatic cancellation.
      </Text>
      <SwitchWithLabel isActive={isActive} setIsActive={setIsActive} label="Schedule early"/>
      </YStack>
    </ModalOverlay>
  );
};

export default SuccessfulReservation;
