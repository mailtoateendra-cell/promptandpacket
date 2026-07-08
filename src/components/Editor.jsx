import React, { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { uploadImage } from "../lib/posts.js";

const Btn = ({ onClick, active, children, title }) => (
  <button
    type="button" title={title} onClick={onClick}
    className={"ed-btn" + (active ? " on" : "")}
  >
    {children}
  </button>
);

export default function Editor({ value, onChange }) {
  const fileRef = useRef(null);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: { HTMLAttributes: { class: "hljs" } } }),
      Image.configure({ HTMLAttributes: { class: "rt-img" } }),
      Link.configure({ openOnClick: false }),
    ],
    content: value || "<p></p>",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const addImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      alert("Image upload failed: " + err.message);
    }
    e.target.value = "";
  };

  const addLink = () => {
    const url = window.prompt("Link URL");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="editor">
      <div className="ed-toolbar">
        <Btn title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></Btn>
        <Btn title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></Btn>
        <Btn title="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>{"</>"}</Btn>
        <span className="ed-sep" />
        <Btn title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Btn>
        <Btn title="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</Btn>
        <span className="ed-sep" />
        <Btn title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>• list</Btn>
        <Btn title="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{"{ }"}</Btn>
        <Btn title="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</Btn>
        <span className="ed-sep" />
        <Btn title="Link" onClick={addLink}>🔗</Btn>
        <Btn title="Image" onClick={() => fileRef.current?.click()}>🖼</Btn>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={addImage} />
      </div>
      <EditorContent editor={editor} className="ed-content" />
    </div>
  );
}
