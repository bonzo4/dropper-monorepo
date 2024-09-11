import { DatabaseTypes } from "@repo/app-types/database";
import { GiveawayInsert } from "@/lib/types/giveaway";
import { uploadImage } from "@/lib/utils/saveImage";
import { SupabaseClient } from "@supabase/supabase-js";
import Image from "next/image";
import {
  ChangeEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

type Props = {
  supabase: SupabaseClient<DatabaseTypes>;
  icon: string;
  setIcon: (icon: string) => void;
};

export default function ProfileIconUpload({ supabase, icon, setIcon }: Props) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles([...files, ...acceptedFiles]);
    },
    [files]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const removeFile = () => {
    setFiles([]);
    setIcon("");
    toast.success("Image removed");
  };

  useEffect(() => {
    const uploadIcon = async () => {
      if (icon) return;
      const image = files.at(0);
      if (!image) return;

      const toastId = toast.info("Uploading image", { autoClose: false });
      try {
        const imagePath = await uploadImage({
          image,
          supabase,
          bucketName: "icons",
        });
        setIcon(imagePath);
        toast.dismiss(toastId);
        toast.success("Icon uploaded");
      } catch (err: any) {
        toast.dismiss(toastId);
        toast.error(err.message);
      }
    };
    uploadIcon();
  }, [files, supabase, icon, setIcon]);

  if (icon) {
    return (
      <div className="flex flex-col gap-1 items-center">
        <Image
          src={icon}
          width={144}
          height={144}
          alt="icon"
          className="rounded-md"
        />

        <button className="opacity-50" onClick={removeFile}>
          Remove
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps({
        className:
          "flex flex-row items-center justify-center w-36 h-36 px-2 outline-dashed rounded-md hover:cursor-pointer",
      })}
    >
      <input {...getInputProps()} />
      <p className="text-center text-sm">
        {"Drag 'n' drop or upload your icon here"}
      </p>
      {icon && <span>{icon}</span>}
    </div>
  );
}
