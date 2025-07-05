/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import clsx from "clsx";

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
        className={clsx("ql-editor max-h-[1000px] overflow-auto", className)}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(html),
        }}
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
export function normalizeHtmlStructure(rawHtml: string): string {
  const blockTags = ["ol", "ul", "div", "table", "pre", "blockquote"];

  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, "text/html");

  const paragraphs = doc.querySelectorAll("p");

  paragraphs.forEach((p) => {
    blockTags.forEach((tag) => {
      const blocks = p.querySelectorAll(tag);

      blocks.forEach((block) => {
        // Clone block để chuyển ra ngoài
        const clone = block.cloneNode(true);
        const parent = p.parentNode;
        if (!parent) return;

        // Tách phần trước block
        const rangeBefore = document.createRange();
        rangeBefore.setStart(p, 0);
        rangeBefore.setEndBefore(block);
        const before = rangeBefore.cloneContents();

        if (before.textContent?.trim()) {
          const pBefore = document.createElement("p");
          pBefore.appendChild(before);
          parent.insertBefore(pBefore, p);
        }

        // Thêm block ra ngoài
        parent.insertBefore(clone, p);

        // Tách phần sau block
        const rangeAfter = document.createRange();
        rangeAfter.setStartAfter(block);
        rangeAfter.setEndAfter(p);
        const after = rangeAfter.cloneContents();

        if (after.textContent?.trim()) {
          const pAfter = document.createElement("p");
          pAfter.appendChild(after);
          parent.insertBefore(pAfter, p.nextSibling);
        }

        // Xoá block và thẻ <p> cũ
        block.remove();
        p.remove();
      });
    });
  });

  return doc.body.innerHTML;
}
