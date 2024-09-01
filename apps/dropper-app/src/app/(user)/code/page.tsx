"use client";
import CodeSubmit from "../components/CodeSubmit";
import ToastStyling from "@/components/ToastStyling";
import logo from "@/public/logo.png";
import Image from "next/image";

export default function Code() {
  return (
    <main className="flex flex-col items-center justify-center grow gap-12 px-5">
      <div className="flex flex-col items-center justify-center ">
        {/* <Icon height={162} />
        <Logo height={177} /> */}
        <Image src={logo} alt="logo" height={100} />
      </div>
      <div className="flex flex-col items-center justify-center gap-[20px]">
        <div className="self-stretch flex flex-col items-center justify-center gap-[20px] text-white ">
          <h1>
            To access Dropper, you will need to enter an access code. If you
            don&apos;t have one, please contact one of our team members.
          </h1>
          <CodeSubmit />
        </div>
      </div>
      <ToastStyling />
    </main>
  );
}
