"use client";
import clsx from "clsx";
import StandaloneQuill from "./standaloneQuill";

type RichTextEditorProps = Parameters<typeof StandaloneQuill>[0] & {
  className?: string;
};
import dynamic from "next/dynamic";

// ✅ Import Quill component chỉ trên client
const ClientEditor = dynamic(() => import("./standaloneQuill"), {
  ssr: false,
  loading: () => <div>Đang tải Editor...</div>,
});
export default function RichTextEditor({
  className = "",
  ...props
}: RichTextEditorProps) {
  return (
    <div className={clsx("w-full", className)}>
      <div className="rounded-box border border-base-300 bg-white">
        <ClientEditor {...props} />
      </div>
    </div>
  );
}
