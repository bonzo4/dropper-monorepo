import { mono } from "@repo/ui/utils";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastStyling() {
  return (
    <ToastContainer
      position="bottom-right"
      toastStyle={{ ...mono.style, background: "#191919", color: "#fff" }}
    />
  );
}
