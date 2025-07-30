/* eslint-disable react-hooks/exhaustive-deps */
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
  const [highlightIndex, setHighlightIndex] = useState<number>(0);
  const [keyword, setKeyword] = useState("");
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const [suggestions, setSuggestions] = useState(suggestList ?? []);

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
    "link",
  ];

  useEffect(() => {
    if (quillRef.current) {
      const instance = quillRef.current.getEditor();
      setEditor(instance);
    }
  }, [quillRef]);

  useEffect(() => {
    if (!editor?.root) return;

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "@") {
        const sel = editor.getSelection();
        if (!sel) return;
        const bounds = editor.getBounds(sel.index);
        setMentionStartIndex(sel.index); // Track where @ started
        setKeyword("");
        setPos({
          top: bounds?.top ? bounds.top + 30 : 30,
          left: bounds?.left ?? 30,
        });
        setShowSuggest(true);
      }

      // Move this block outside so it always runs if showSuggest is true
      if (showSuggest && suggestions.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setHighlightIndex((prev) => (prev + 1) % suggestions.length);
        }

        if (e.key === "ArrowUp") {
          e.preventDefault();
          setHighlightIndex(
            (prev) => (prev - 1 + suggestions.length) % suggestions.length
          );
        }
        if (e.key === "Escape") {
          e.preventDefault();
          setShowSuggest(false);
        }
      }
    };

    const handleTextChange = () => {
      setTimeout(() => {
        if (!editor) return;
        if (!editor.hasFocus()) editor.focus();

        const sel = editor.getSelection();
        if (
          !sel ||
          mentionStartIndex === null ||
          sel.index <= mentionStartIndex
        ) {
          setShowSuggest(false);
          setMentionStartIndex(null);
          return;
        }

        const text = editor.getText(
          mentionStartIndex,
          sel.index - mentionStartIndex
        );
        if (/\s/.test(text)) {
          setShowSuggest(false);
          setMentionStartIndex(null);
        } else {
          setKeyword(text.replace("@", ""));
          setShowSuggest(true);
        }
      }, 0);
    };

    const el = editor.root;
    el.addEventListener("keydown", handleKeydown);
    editor.on("text-change", handleTextChange);

    return () => {
      el.removeEventListener("keydown", handleKeydown);
      editor.off("text-change", handleTextChange);
    };
  }, [editor, mentionStartIndex, highlightIndex, showSuggest]);

  useEffect(() => {
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      if (showSuggest && suggestions.length > 0) {
        if (e.key === "Enter") {
          e.preventDefault();
          const selected = suggestions[highlightIndex];
          if (selected) {
            handleSelect(selected);
          }
        }
      }
    };

    document.addEventListener("keydown", handleGlobalKeydown);
    return () => {
      document.removeEventListener("keydown", handleGlobalKeydown);
    };
  }, [showSuggest, suggestions, highlightIndex]);
  useEffect(() => {
    if (keyword.trim() !== "")
      setSuggestions(
        suggestList?.filter((u) =>
          u.toLowerCase().includes(keyword.toLowerCase())
        ) ?? []
      );
    else {
      setSuggestions(suggestList ?? []);
    }
  }, [keyword]);
  const handleSelect = (name: string) => {
    if (!editor || mentionStartIndex == null) return;
    const sel = editor.getSelection();
    if (!sel) return;
    const length = sel.index - mentionStartIndex;
    // Xoá phần từ @ tới con trỏ
    editor.deleteText(mentionStartIndex, length);

    // Chèn lại mention với format
    editor.insertText(mentionStartIndex, `@${name}`);

    // Chèn thêm khoảng trắng sau mention
    const newIndex = mentionStartIndex + name.length + 1;
    editor.insertText(newIndex, " ");
    editor.setSelection(newIndex + 1);

    // Reset trạng thái mention
    setShowSuggest(false);
    setMentionStartIndex(null);
  };

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
          className="absolute  border rounded z-60 w-fit bg-base-200 max-h-[200px] overflow-auto"
          style={{ left: pos.left, top: pos.top + 30 }}
        >
          {suggestions.map((u, index) => (
            <li
              key={u}
              className={`px-2 py-1 cursor-pointer ${
                index === highlightIndex
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(u);
              }}
            >
              {u}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
