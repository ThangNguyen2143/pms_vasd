"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type ReactQuill from "react-quill-new";
import { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import QuillWrapper from "./QuillWrapper";

// const QuillNoSSRWrapper = lazy(() => import("./QuillWrapper"));

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  suggestList?: string[];
}

export default function StandaloneQuill({
  value,
  onChange,
  placeholder,
  suggestList,
}: Props) {
  const quillRef = useRef<ReactQuill | null>(null);
  const [editor, setEditor] = useState<Quill | null>(null);
  // const [savedSelection, setSavedSelection] = useState<RangeStatic | null>(
  //   null
  // );
  const [mentionStartIndex, setMentionStartIndex] = useState<number | null>(
    null
  );
  const [showSuggest, setShowSuggest] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const modules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ["image", "link"],
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
    if (quillRef.current) {
      const instance = quillRef.current.getEditor();
      setEditor(instance);
    }
  }, [quillRef]);

  useEffect(() => {
    if (!editor?.root) return;

    // const handlePaste = (e: ClipboardEvent) => {
    //   const items = e.clipboardData?.items;
    //   if (!items) return;
    //   let hasImage = false;
    //   for (const item of items) {
    //     console.log("type:", item.type);
    //     if (item.type.startsWith("image")) {
    //       hasImage = true;
    //       const file = item.getAsFile();
    //       if (file) {
    //         const reader = new FileReader();
    //         reader.onload = (evt) => {
    //           const base64 = evt.target?.result;
    //           const range = editor.getSelection(true);
    //           editor.insertEmbed(range.index, "image", base64);
    //         };
    //         reader.readAsDataURL(file);
    //       }
    //     }
    //   }
    //   if (hasImage) {
    //     e.preventDefault(); // ✅ Chặn dán mặc định
    //   }
    // };

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "@") {
        const sel = editor.getSelection();
        if (!sel) return;
        const bounds = editor.getBounds(sel.index);
        setKeyword("");
        setMentionStartIndex(sel.index + 1); // Track where @ started
        setPos({
          top: bounds?.top ? bounds.top + 30 : 30,
          left: bounds?.left ?? 30,
        });
        setShowSuggest(true);
      }
    };

    const handleTextChange = () => {
      if (!editor) return;
      if (!editor.hasFocus()) editor.focus();
      const sel = editor.getSelection();
      if (
        !sel ||
        mentionStartIndex === null ||
        sel.index < mentionStartIndex - 1
      ) {
        setShowSuggest(false);
        setMentionStartIndex(null);
        return;
      }
      const text = editor.getText(
        mentionStartIndex,
        sel.index - mentionStartIndex
      );
      if (/\\s/.test(text)) {
        setShowSuggest(false);
        setMentionStartIndex(null);
      } else {
        setKeyword(text);
      }
    };

    const el = editor.root;
    // el.addEventListener("paste", handlePaste);
    el.addEventListener("keydown", handleKeydown);
    editor.on("text-change", handleTextChange);

    return () => {
      // el.removeEventListener("paste", handlePaste);
      el.removeEventListener("keydown", handleKeydown);
      editor.off("text-change", handleTextChange);
    };
  }, [editor, mentionStartIndex]);

  const handleSelect = (name: string) => {
    if (!editor || mentionStartIndex == null) return;
    const sel = editor.getSelection();
    if (!sel) return;
    const length = sel.index - mentionStartIndex;
    editor.deleteText(mentionStartIndex, length);
    editor.insertText(mentionStartIndex, `${name}`, {
      bold: true,
      background: "#ffffdd",
    });
    editor.insertText(mentionStartIndex + name.length + 1, " ");
    editor.format("bold", false);
    editor.setSelection(mentionStartIndex + name.length + 1);
    setShowSuggest(false);
    setMentionStartIndex(null);
  };

  const suggestions = suggestList?.filter((u) =>
    u.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="relative">
      <QuillWrapper
        ref={quillRef}
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        theme="snow"
      />

      {showSuggest && suggestions && suggestions.length > 0 && (
        <ul
          className="absolute  border rounded z-60 w-fit bg-base-200"
          style={{ left: pos.left }}
        >
          {suggestions.map((u) => (
            <li
              key={u}
              className="px-2 py-1  cursor-pointer"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(u);
              }}
            >
              @{u}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
