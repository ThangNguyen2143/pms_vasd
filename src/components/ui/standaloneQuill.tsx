"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
// import ReactQuillProps from "react-quill-new";

const QuillNoSSRWrapper = dynamic(
  () => import("react-quill-new").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="text-sm text-gray-400">Đang tải editor...</div>
    ),
  }
);

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editor, setEditor] = useState<any>(null);

  const modules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ["image"],
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
    "image",
  ];

  useEffect(() => {
    if (!editor || !editor.root) return;

    const handlePaste = (e: ClipboardEvent) => {
      const clipboardItems = e.clipboardData?.items;
      if (!clipboardItems) return;

      for (const item of clipboardItems) {
        if (item.type.indexOf("image") === 0) {
          const file = item.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              const base64Image = evt.target?.result;
              const range = editor.getSelection(true);
              editor.insertEmbed(range.index, "image", base64Image);
            };
            reader.readAsDataURL(file);
          }
        }
      }
    };

    const el = editor.root;
    el.addEventListener("paste", handlePaste);
    return () => el.removeEventListener("paste", handlePaste);
  }, [editor]);

  return (
    <QuillNoSSRWrapper
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      placeholder={placeholder}
      onChangeSelection={(_selection, _source, editorInstance) => {
        if (!editor) setEditor(editorInstance);
      }}
    />
  );
}
