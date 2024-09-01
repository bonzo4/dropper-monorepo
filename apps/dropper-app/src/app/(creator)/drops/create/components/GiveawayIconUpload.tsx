import { DatabaseTypes } from "@repo/types/database";
import { GiveawayInsert } from "@repo/types/giveaway";
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

type IconUploadProps = {
  supabase: SupabaseClient<DatabaseTypes>;
  setGiveaway: (args_0: SetStateAction<GiveawayInsert>) => void;
  giveaway: GiveawayInsert;
};

export default function IconUpload({
  supabase,
  setGiveaway,
  giveaway,
}: IconUploadProps) {
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
    setGiveaway({ ...giveaway, icon_url: "" });
    toast.success("Image removed");
  };

  useEffect(() => {
    const uploadIcon = async () => {
      if (giveaway.icon_url) return;
      const image = files.at(0);
      if (!image) return;

      const toastId = toast.info("Uploading image", { autoClose: false });
      try {
        const imagePath = await uploadImage({
          image,
          supabase,
          bucketName: "giveaway_images",
        });

        setGiveaway((prev) => ({
          ...prev,
          icon_url: imagePath,
        }));
        toast.dismiss(toastId);
        toast.success("Icon uploaded");
      } catch (err: any) {
        toast.dismiss(toastId);
        toast.error(err.message);
      }
    };
    uploadIcon();
  }, [files, setGiveaway, supabase, giveaway]);

  if (giveaway.icon_url) {
    return (
      <div className="flex flex-col gap-1 items-center">
        <Image
          src={giveaway.icon_url}
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
      {giveaway.icon_url && <span>{giveaway.icon_url}</span>}
    </div>
  );
}
