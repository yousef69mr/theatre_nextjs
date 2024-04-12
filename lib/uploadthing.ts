import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/user-actor-link/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

export const deleteFile = async (url: string) => {
  await fetch("/api/uploadthing", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
    method: "DELETE",
  });
};
