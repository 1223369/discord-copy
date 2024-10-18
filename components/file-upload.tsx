"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css"

interface FileUploaderProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

export const FileUploader = ({
  onChange,
  value,
  endpoint
}: FileUploaderProps) => {

  const fileType = value?.split('.').pop();

  if (value && fileType !== 'pdf') {
    return (
      <div className="relative h-20 w-20">
        <Image 
          fill
          src={value}
          alt="Uploaded Image"
          className="rounded-full"
        />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1
          rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="H-4 W-4"/>
        </button>
      </div>
    )
  }

  return (
    <div className="w-full">
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url)
        }}
        onUploadError={(error: Error) => {
          console.log('Upload Error', error)
        }}
      />
    </div>
  );
};
