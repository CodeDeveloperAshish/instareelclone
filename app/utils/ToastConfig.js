import Toast, { BaseToast } from "react-native-toast-message";
import Colors from "./Colors";

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: Colors.PrimaryColor,
        marginTop: 15,
        width: "90%",
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
    />
  ),
  error: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "red",
        marginTop: 15,
        width: "90%",
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
    />
  ),
};
