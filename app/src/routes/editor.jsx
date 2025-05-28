import React, { useEffect, useState } from 'react';
import CodeEditor from '../../components/code-editor';

const initialCode = {
    javascript: `// JavaScript Example

function main() {
    console.log("hello world");
}`,

    python: `# Python Example

def main():
    print("hello world")
`,

    bash: `#!/bin/bash
# Bash Script Example

main() {
    echo "hello world"
}
`
};


export default function Editor() {
    const [language, setLanguage] = useState("javascript")
    const [editorHelp, setEditorHelp] = useState(false)
    const [code, setCode] = useState(initialCode[language])

    const handleLanguageChange = (e) => {
        const newLang = e.target.value
        setLanguage(newLang)
        setCode(initialCode[newLang])
    }

    const languageInfo = {
        javascript: { label: "JavaScript", color: "bg-yellow-500" },
        python: { label: "Python", color: "bg-blue-500" },
        bash: { label: "Bash", color: "bg-green-500" },
    }

    return (
        <div className="h-screen bg-[#282a36] p-4">
            <div className="mx-auto space-y-4 h-full flex flex-col">
                <div className={`bg-[#44475a] border border-[#6272a4] rounded-lg ${editorHelp ? "h-[70%]" : "h-full"}`}>
                    <div className="flex items-center justify-between p-4 border-b h-[50px] border-[#6272a4]">
                        <h2 className="text-[#f8f8f2] flex items-center gap-2 text-lg font-semibold">
                            CodeMirror Editor - Dracula Theme
                            <span className={`text-xs px-2 py-0.5 rounded ${languageInfo[language].color}`}>
                                {languageInfo[language].label}
                            </span>
                            <button onClick={() => setEditorHelp(!editorHelp)}>
                                {!editorHelp ? "ajuda" : "fechar ajuda"}
                            </button>
                        </h2>
                        <select
                            value={language}
                            onChange={handleLanguageChange}
                            className="bg-[#282a36] border border-[#6272a4] text-[#f8f8f2] rounded px-2 py-1"
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="bash">Bash</option>
                        </select>
                    </div>
                    <div className="p-0 h-[calc(100%-50px)]">
                        <CodeEditor value={code} onChange={setCode} language={language}  />
                    </div>
                </div>

                {
                    editorHelp && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[30%]">
                            <div className="bg-[#44475a] border border-[#6272a4] rounded-lg p-4">
                                <h3 className="text-[#f8f8f2] text-sm font-semibold mb-2">Features</h3>
                                <ul className="text-[#f8f8f2] text-sm space-y-1 list-disc list-inside">
                                    <li>Syntax highlighting</li>
                                    <li>Line numbers</li>
                                    <li>Code folding</li>
                                    <li>Auto-completion</li>
                                    <li>Bracket matching</li>
                                </ul>
                            </div>

                            <div className="bg-[#44475a] border border-[#6272a4] rounded-lg p-4">
                                <h3 className="text-[#f8f8f2] text-sm font-semibold mb-2">Shortcuts</h3>
                                <ul className="text-[#f8f8f2] text-sm space-y-1 list-disc list-inside">
                                    <li>Ctrl+/ - Toggle comment</li>
                                    <li>Ctrl+D - Select next occurrence</li>
                                    <li>Ctrl+F - Find</li>
                                    <li>Ctrl+H - Replace</li>
                                    <li>Tab - Indent</li>
                                </ul>
                            </div>

                            <div className="bg-[#44475a] border border-[#6272a4] rounded-lg p-4">
                                <h3 className="text-[#f8f8f2] text-sm font-semibold mb-2">Languages</h3>
                                <ul className="text-[#f8f8f2] text-sm space-y-1 list-disc list-inside">
                                    <li>JavaScript/TypeScript</li>
                                    <li>Python</li>
                                    <li>Bash/Shell</li>
                                    <li>Full syntax support</li>
                                    <li>Language-specific features</li>
                                </ul>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
