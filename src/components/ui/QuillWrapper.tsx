"use client";
import ReactQuill from "react-quill-new";
// import type { ReactQuillProps } from "react-quill-new";
import { forwardRef } from "react";

const QuillWrapper = forwardRef<ReactQuill, ReactQuill.ReactQuillProps>(
  (props, ref) => {
    return <ReactQuill ref={ref} {...props} />;
  }
);

QuillWrapper.displayName = "QuillWrapper";

export default QuillWrapper;
