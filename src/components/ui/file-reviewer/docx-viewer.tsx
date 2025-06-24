"use client";
import { useEffect, useState } from "react";
import mammoth from "mammoth";

export default function DocxViewer({ file }: { file: File }) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    if (!file) return;
    file.arrayBuffer().then((arrayBuffer) => {
      mammoth.convertToHtml({ arrayBuffer }).then((result) => {
        setHtml(result.value);
      });
    });
  }, [file]);

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
