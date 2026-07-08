import React from "react";
import DOMPurify from "dompurify";

export default function RichText({ html }) {
  const clean = DOMPurify.sanitize(html || "");
  return <div className="rt" dangerouslySetInnerHTML={{ __html: clean }} />;
}
