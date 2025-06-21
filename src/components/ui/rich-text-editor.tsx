import clsx from "clsx";
import StandaloneQuill from "./standaloneQuill";

type RichTextEditorProps = Parameters<typeof StandaloneQuill>[0] & {
  className?: string;
};
export default function RichTextEditor({
  className = "",
  ...props
}: RichTextEditorProps) {
  return (
    <div className={clsx("w-full", className)}>
      <div className="rounded-box border border-base-300 bg-white overflow-hidden">
        <StandaloneQuill {...props} />
      </div>
    </div>
  );
}
