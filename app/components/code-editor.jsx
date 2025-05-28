// components/code-editor.tsx
import React, { useEffect, useRef } from "react"
import { EditorView, basicSetup } from "codemirror"
import { EditorState } from "@codemirror/state"
import { javascript } from "@codemirror/lang-javascript"
import { python } from "@codemirror/lang-python"
import { StreamLanguage } from "@codemirror/language"
import { shell } from "@codemirror/legacy-modes/mode/shell"

// Dracula theme colors
const draculaTheme = EditorView.theme(
  {
    "&": {
      color: "#f8f8f2",
      backgroundColor: "#282a36",
      fontSize: "14px",
      fontFamily: '"Fira Code", "JetBrains Mono", "Monaco", monospace',
    },
    ".cm-content": {
      padding: "16px",
      minHeight: "100%",
      caretColor: "#f8f8f2",
    },
    ".cm-editor": {
      borderRadius: "8px",
      height: "100%",
    },
    ".cm-gutters": {
      backgroundColor: "#282a36",
      color: "#6272a4",
      borderRight: "1px solid #44475a",
    },
    ".cm-activeLine": {
      backgroundColor: "#44475a40",
    },
    ".cm-selectionBackground": {
      backgroundColor: "#44475a",
    },
    ".cm-cursor": {
      borderLeftColor: "#f8f8f2",
    },
  },
  { dark: true }
)

export default function CodeEditor({ value, onChange, language }) {
  const editorRef = useRef(null)
  const viewRef = useRef(null)

  useEffect(() => {
    if (!editorRef.current) return

    const getLanguageExtension = () => {
      switch (language) {
        case "javascript":
          return javascript()
        case "python":
          return python()
        case "bash":
          return StreamLanguage.define(shell)
        default:
          return javascript()
      }
    }

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        getLanguageExtension(),
        draculaTheme,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString())
          }
        }),
        EditorView.lineWrapping,
      ],
    })

    if (viewRef.current) viewRef.current.destroy()

    viewRef.current = new EditorView({
      state,
      parent: editorRef.current,
    })

    return () => {
      if (viewRef.current) viewRef.current.destroy()
    }
  }, [language])

  useEffect(() => {
    if (viewRef.current && viewRef.current.state.doc.toString() !== value) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: value,
        },
      })
    }
  }, [value])

  return <div ref={editorRef} className="w-full h-full overflow-hidden bg-red-700" />
}
