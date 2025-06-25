/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";

interface Props {
  html: string;
  className?: string;
}

export default function SafeHtmlViewer({ html, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  // Gắn click khi có <img>
  const bindClickToImages = () => {
    const container = ref.current;
    if (!container) return;

    const images = container.querySelectorAll("img");

    images.forEach((img) => {
      img.style.cursor = "zoom-in";
      img.onclick = () => setPreviewImg(img.src); // Không cần addEventListener nữa
    });
  };

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    // Gắn sự kiện ban đầu
    bindClickToImages();

    // Theo dõi DOM nếu nội dung bị re-render
    const observer = new MutationObserver(() => {
      bindClickToImages();
    });

    observer.observe(container, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [html]);

  return (
    <>
      <div
        ref={ref}
        className={className}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
      />
      {previewImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setPreviewImg(null)}
        >
          <img
            src={previewImg}
            alt="preview"
            className="max-w-full max-h-full rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={() => setPreviewImg(null)}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
