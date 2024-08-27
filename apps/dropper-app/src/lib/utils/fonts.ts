import localFont from "next/font/local";
import { Sometype_Mono } from "next/font/google";

export const dropper = localFont({
  src: "../../../public/dropper.otf",
  variable: "--dropper-sans",
});

export const mono = Sometype_Mono({
  variable: "--mono",
  subsets: ["latin"],
});
