import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastStyling() {
  return (
    <ToastContainer
      position="bottom-right"
      toastClassName={() => "bg-secondary flex px-4 py-2 my-4 rounded-lg"}
    />
  );
}
