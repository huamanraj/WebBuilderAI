import React, { useRef, useEffect, memo } from 'react';
import MonacoEditor from 'react-monaco-editor';

const CodeEditor = ({ language = 'javascript', value = '', onChange, options = {} }) => {
  const editorRef = useRef(null);

  const defaultOptions = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: true,
    minimap: {
      enabled: false
    },
    scrollBeyondLastLine: false,
    lineNumbers: 'on',
    scrollbar: {
      useShadows: false,
      verticalHasArrows: false,
      horizontalHasArrows: false,
      vertical: 'visible',
      horizontal: 'visible'
    },
    fontSize: 14,
    ...options
  };

  const editorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.focus();
    
    // Map language names to Monaco's language identifiers
    const languageMap = {
      html: 'html',
      css: 'css',
      javascript: 'javascript'
    };
    
    // Set the language mode
    monaco.editor.setModelLanguage(editor.getModel(), languageMap[language] || 'plaintext');
  };

  const handleEditorChange = (newValue) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  // Theme settings
  useEffect(() => {
    // This would be a good place to register custom themes if needed
  }, []);

  return (
    <div className="h-[calc(100vh-280px)] overflow-hidden">
      <MonacoEditor
        height="calc(100vh - 350px)"
        language={language}
        value={value}
        options={defaultOptions}
        onChange={handleEditorChange}
        editorDidMount={editorDidMount}
        theme="vs-dark"
      />
    </div>
  );
};

export default memo(CodeEditor);
