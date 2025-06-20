"use client";

import clsx from "clsx";
import DOMPurify from "dompurify";

interface SafeHtmlViewerProps {
  html: string;
  className?: string;
}

const SafeHtmlViewer: React.FC<SafeHtmlViewerProps> = ({ html, className }) => {
  return (
    <div
      className={clsx(className, "max-h-96 overflow-y-auto")}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
    />
  );
};

export default SafeHtmlViewer;
