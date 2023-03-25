import Modal from "react-native-modal";
import { Alert,  StyleSheet, Text, Pressable, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {Button} from "tamagui";

type ModalOverlayProp = {
  isOpen: boolean;
  children?: JSX.Element;
  closeModal : () => void;
};
const SuccessfulReservation = ({ isOpen, children, closeModal }: ModalOverlayProp) => {
//   const [modalVisible, setModalVisible] = useState(isOpen);
  return (
    <View style={{ flex: 1 }}>
      <Modal isVisible={isOpen}>
        <View style={{ flex: 1 }}>
          <Text>Hello!</Text>

          <Button onPress={closeModal}  />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor:"white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default SuccessfulReservation;
