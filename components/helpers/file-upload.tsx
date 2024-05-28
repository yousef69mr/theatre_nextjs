"use client";

import { FileIcon, X } from "lucide-react";
import Image from "next/image";

import "@uploadthing/react/styles.css";

import { UploadDropzone, deleteFile } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { HTMLAttributes, SetStateAction } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface FileUploadProps
  extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  endpoint:
    | "playImage"
    | "executorImage"
    | "actorImage"
    | "userImage"
    | "playImagesGallery"
    | "festivalImage"
    | "actorInPlayImage"
    | "messageFile";
  value: string;
  onChange: (url?: string) => void;
  onLoading?: SetStateAction<boolean>;
}

const FileUpload = (props: FileUploadProps) => {
  const { endpoint, onChange, value, className } = props;

  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div
        className={cn("relative max-w-full md:max-w-32 rounded-lg", className)}
      >
        {/* <Image src={value} alt="Upload" fill /> */}
        <AspectRatio ratio={2 / 3} className="bg-muted">
          <Image
            src={value}
            fill
            sizes="32x32 64x64 128x128"
            alt="Image"
            className="rounded-md object-contain"
          />
        </AspectRatio>
        <button
          onClick={async () => {
            await deleteFile(value);
            onChange("");
          }}
          className="text-white bg-rose-500 p-1 rounded-full absolute -top-2 ltr:-right-2 rtl:-left-3 shadow-sm"
          type="button"
          title="remove button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline flex-1"
        >
          {value}
        </a>
        <button
          title="Remove file"
          onClick={async () => {
            await deleteFile(value);
            onChange("");
          }}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 ltr:-right-2 rtl:-left-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="border-primary border-dashed rounded py-6 px-8">
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          console.error(error);
        }}
      />
    </div>
  );
};

export default FileUpload;
