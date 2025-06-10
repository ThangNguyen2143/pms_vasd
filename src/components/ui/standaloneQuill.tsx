// components/StandaloneQuill.tsx
"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill-new/dist/quill.snow.css";

const Quill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="text-sm text-gray-400">Đang tải editor...</div>
  ),
});

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function StandaloneQuill({
  value,
  onChange,
  placeholder,
}: Props) {
  const modules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
      ],
    }),
    []
  );

  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "indent",
    "align",
    "color",
    "background",
  ];

  return (
    <Quill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      placeholder={placeholder}
    />
  );
}
