"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { NodeSelection } from "@tiptap/pm/state";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useState, useCallback, useEffect, useRef } from "react";
import {
  Bold, Italic, List, ListOrdered, Heading1, Heading2,
  Quote, Undo, Redo, ImageIcon, Pilcrow, Loader2, Trash2,
} from "lucide-react";

const MenuButton = ({ onClick, active, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex h-8 w-8 items-center justify-center rounded-sm transition-colors ${
      active ? "bg-accent text-primary" : "text-text/50 hover:bg-accent/10 hover:text-accent"
    }`}
  >
    {children}
  </button>
);

export default function RichEditor({ content, onChange, uploadImage }) {
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const editorRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      const { selection } = editor.state;
      if (selection instanceof NodeSelection && selection.node.type.name === "image") {
        setSelectedImage(selection.node.attrs.src);
      } else {
        setSelectedImage(null);
      }
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[300px] px-4 py-3 font-sans text-sm text-text",
      },
    },
  });

  useEffect(() => {
    if (editor) editorRef.current = editor;
  }, [editor]);

  const addImage = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) return;
      if (file.size > 8 * 1024 * 1024) return;

      setUploading(true);
      try {
        if (uploadImage) {
          const url = await uploadImage(file);
          editor?.chain().focus().setImage({ src: url }).run();
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            editor?.chain().focus().setImage({ src: reader.result }).run();
          };
          reader.readAsDataURL(file);
        }
      } catch {
        // fallback
      } finally {
        setUploading(false);
      }
    };
    input.click();
  }, [editor, uploadImage]);

  const deleteSelectedImage = useCallback(() => {
    editor?.chain().focus().deleteSelection().run();
    setSelectedImage(null);
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="rounded-sm border border-primary/10 bg-white overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-primary/10 bg-bg-alt px-3 py-2">
        <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
          <Bold size={14} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
          <Italic size={14} />
        </MenuButton>
        <span className="mx-1 h-5 w-px bg-primary/10" />
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })}>
          <Heading1 size={14} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
          <Heading2 size={14} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive("paragraph")}>
          <Pilcrow size={14} />
        </MenuButton>
        <span className="mx-1 h-5 w-px bg-primary/10" />
        <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
          <List size={14} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
          <ListOrdered size={14} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
          <Quote size={14} />
        </MenuButton>
        <span className="mx-1 h-5 w-px bg-primary/10" />
        <MenuButton onClick={addImage}>
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
        </MenuButton>
        <span className="mx-1 h-5 w-px bg-primary/10" />
        {selectedImage && (
          <MenuButton onClick={deleteSelectedImage} active={false}>
            <Trash2 size={14} className="text-red-500" />
          </MenuButton>
        )}
        <MenuButton onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={14} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={14} />
        </MenuButton>
      </div>
      <EditorContent editor={editor} />
      <p className="px-4 py-2 font-sans text-[9px] text-text/30 border-t border-primary/5">
        Seleccione una imagen en el contenido y presione el botón{" "}
        <Trash2 size={10} className="inline text-red-400" /> para eliminarla
      </p>
    </div>
  );
}
