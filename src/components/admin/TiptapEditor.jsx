"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    List,
    ListOrdered,
    Heading2,
    Heading3,
    Undo2,
    Redo2,
    Pilcrow,
    Link as LinkIcon,
    ImageIcon,
    Trash2
} from 'lucide-react'
import { useEffect } from 'react'

const MenuBar = ({ editor, error }) => {
    if (!editor) return null

    const buttonClass = 'p-2 hover:bg-base-200 rounded transition-colors text-sm font-medium'
    const activeButtonClass = 'bg-primary text-primary-content'

    const addImage = () => {
        const url = prompt('Enter image URL:')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    const addLink = () => {
        const url = prompt('Enter URL:')
        if (url) {
            editor.chain().focus().setLink({ href: url }).run()
        }
    }

    const removeLink = () => {
        editor.chain().focus().unsetLink().run()
    }

    return (
        <div className={`border-b ${error ? 'border-error bg-error bg-opacity-5' : 'border-base-200'} flex flex-wrap gap-1 p-2 bg-base-100 rounded-t-lg`}>
            <div className="divider divider-horizontal m-0 w-auto h-8" />
            
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`${buttonClass} ${editor.isActive('bold') ? activeButtonClass : ''}`}
                title="Bold"
            >
                <Bold size={18} />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`${buttonClass} ${editor.isActive('italic') ? activeButtonClass : ''}`}
                title="Italic"
            >
                <Italic size={18} />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`${buttonClass} ${editor.isActive('strike') ? activeButtonClass : ''}`}
                title="Strikethrough"
            >
                <Strikethrough size={18} />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`${buttonClass} ${editor.isActive('code') ? activeButtonClass : ''}`}
                title="Inline Code"
            >
                <Code size={18} />
            </button>

            <div className="divider divider-horizontal m-0 w-auto h-8" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`${buttonClass} ${editor.isActive('heading', { level: 2 }) ? activeButtonClass : ''}`}
                title="Heading 2"
            >
                <Heading2 size={18} />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`${buttonClass} ${editor.isActive('heading', { level: 3 }) ? activeButtonClass : ''}`}
                title="Heading 3"
            >
                <Heading3 size={18} />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`${buttonClass} ${editor.isActive('bulletList') ? activeButtonClass : ''}`}
                title="Bullet List"
            >
                <List size={18} />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`${buttonClass} ${editor.isActive('orderedList') ? activeButtonClass : ''}`}
                title="Ordered List"
            >
                <ListOrdered size={18} />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`${buttonClass} ${editor.isActive('codeBlock') ? activeButtonClass : ''}`}
                title="Code Block"
            >
                <Pilcrow size={18} />
            </button>

            <div className="divider divider-horizontal m-0 w-auto h-8" />

            <button
                type="button"
                onClick={addLink}
                className={`${buttonClass} ${editor.isActive('link') ? activeButtonClass : ''}`}
                title="Add Link"
            >
                <LinkIcon size={18} />
            </button>

            {editor.isActive('link') && (
                <button
                    type="button"
                    onClick={removeLink}
                    className={`${buttonClass} text-error hover:bg-error hover:bg-opacity-10`}
                    title="Remove Link"
                >
                    <Trash2 size={18} />
                </button>
            )}

            <button
                type="button"
                onClick={addImage}
                className={`${buttonClass}`}
                title="Add Image"
            >
                <ImageIcon size={18} />
            </button>

            <div className="divider divider-horizontal m-0 w-auto h-8" />

            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                className={buttonClass}
                title="Undo"
            >
                <Undo2 size={18} />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                className={buttonClass}
                title="Redo"
            >
                <Redo2 size={18} />
            </button>
        </div>
    )
}

export default function TiptapEditor({
    value = '',
    onChange,
    error = null,
    placeholder = 'Start typing...',
    minHeight = '200px',
    maxHeight = 'none'
}) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3]
                }
            }),
            Link.configure({
                openOnClick: false
            }),
            Image
        ],
        content: value || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        }
    })

    // Update editor content when value prop changes
    useEffect(() => {
        if (editor && value && editor.getHTML() !== value) {
            editor.commands.setContent(value)
        }
    }, [value, editor])

    return (
        <div className={`border rounded-lg overflow-hidden ${error ? 'border-error' : 'border-base-200'}`}>
            <MenuBar editor={editor} error={error} />
            <EditorContent
                editor={editor}
                className={`prose prose-sm max-w-none w-full focus:outline-none p-4 bg-base-50 text-base-content`}
                style={{
                    minHeight,
                    maxHeight,
                    overflow: 'auto'
                }}
            />
            {error && (
                <div className="px-4 py-2 bg-error bg-opacity-5 border-t border-error text-error text-sm">
                    {error}
                </div>
            )}
        </div>
    )
}
