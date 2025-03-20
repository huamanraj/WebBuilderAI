import React, { useRef, useEffect, memo } from 'react';
import MonacoEditor from 'react-monaco-editor';

const CodeEditor = ({ language = 'javascript', value = '', onChange, options = {} }) => {
  const editorRef = useRef(null);
  
  // Check if we're in full-page mode by looking at options
  const isFullPage = options.fontSize === 15;

  const defaultOptions = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: true,
    minimap: {
      enabled: isFullPage ? true : false
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
    <div className={`${isFullPage ? 'h-[calc(100vh-90px)]' : 'h-[calc(100vh-280px)]'} overflow-hidden`}>
      <MonacoEditor
        height={isFullPage ? "calc(100vh - 90px)" : "calc(100vh - 350px)"}
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
