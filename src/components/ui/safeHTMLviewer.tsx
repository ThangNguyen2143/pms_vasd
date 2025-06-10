"use client";

import DOMPurify from "dompurify";

interface SafeHtmlViewerProps {
  html: string;
  className?: string;
}

const SafeHtmlViewer: React.FC<SafeHtmlViewerProps> = ({ html, className }) => {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
    />
  );
};

export default SafeHtmlViewer;
