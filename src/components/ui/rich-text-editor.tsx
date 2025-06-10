import StandaloneQuill from "./standaloneQuill";

export default function RichTextEditor(
  props: Parameters<typeof StandaloneQuill>[0]
) {
  return (
    <div className="form-control w-full">
      <div className="rounded-box border border-base-300 bg-white overflow-hidden">
        <StandaloneQuill {...props} />
      </div>
    </div>
  );
}
