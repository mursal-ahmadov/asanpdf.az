"use client";

import { useCallback } from "react";
import { useDropzone, Accept } from "react-dropzone";

type Props = {
  onFiles: (files: File[]) => void;
  accept?: Accept;
  multiple?: boolean;
  label?: string;
  hint?: string;
};

export default function FileDrop({
  onFiles,
  accept = { "application/pdf": [".pdf"] },
  multiple = true,
  label = "Faylları bura sürüşdür və ya seç",
  hint = "yalnız PDF",
}: Props) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length) onFiles(accepted);
    },
    [onFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-10 sm:p-16 text-center cursor-pointer transition-all
        ${isDragActive
          ? "border-accent bg-blue-50"
          : "border-border hover:border-accent hover:bg-gray-50"
        }`}
    >
      <input {...getInputProps()} />
      <div className="text-5xl mb-4">📁</div>
      <p className="font-medium text-lg mb-1">{label}</p>
      <p className="text-sm text-muted">{hint}</p>
    </div>
  );
}
