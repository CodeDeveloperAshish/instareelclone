import RootNavigation from "./app/navigation/RootNavigation";
import Toast from "react-native-toast-message";
import { toastConfig } from "./app/utils/ToastConfig";
export default function App() {
  return (
    <>
      <RootNavigation />
      <Toast config={toastConfig} />
    </>
  );
}
