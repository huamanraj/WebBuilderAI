import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPencilAlt } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { 
  FaCode, 
  FaEye, 
  FaSave, 
  FaDownload, 
  FaCopy, 
  FaShareAlt, 
  FaExpand, 
  FaCompress,
  FaArrowLeft,
  FaDesktop 
} from 'react-icons/fa';
import DashboardLayout from '../../layouts/DashboardLayout';
import CodeEditor from '../../components/editor/CodeEditor';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ShareModal from '../../components/modals/ShareModal';

// Get the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Default starter code templates
const defaultHtmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>Welcome to My Website</h1>
    <nav>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section>
      <h2>About Me</h2>
      <p>This is a simple website created with the WebBuilder AI Live Editor.</p>
    </section>
  </main>

  <footer>
    <p>&copy; 2023 My Website. All rights reserved.</p>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;

const defaultCssCode = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 40px;
}

nav ul {
  display: flex;
  list-style: none;
  gap: 20px;
}

nav a {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

nav a:hover {
  color: #2563eb;
}

section {
  margin-bottom: 40px;
}

h1 {
  font-size: 2rem;
  color: #2563eb;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #2563eb;
}

p {
  margin-bottom: 15px;
}

footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}

@media (max-width: 768px) {
  header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  nav ul {
    margin-top: 15px;
    gap: 15px;
  }
}`;

const defaultJsCode = `// Add your JavaScript code here
document.addEventListener('DOMContentLoaded', function() {
  console.log('Website loaded successfully!');
  
  // Example: Add a click event to the h1 element
  const heading = document.querySelector('h1');
  if (heading) {
    heading.addEventListener('click', function() {
      alert('Welcome to my website!');
    });
  }
});`;

const generateRandomTitle = () => {
  const adjectives = ['Amazing', 'Creative', 'Dynamic', 'Elegant', 'Fresh', 'Modern', 'Responsive', 'Sleek', 'Smart', 'Vibrant'];
  const nouns = ['Portfolio', 'Website', 'Landing Page', 'Project', 'Showcase', 'Site', 'Webpage', 'Creation', 'Design', 'Web App'];
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${randomAdjective} ${randomNoun}`;
};

const LiveEditorPage = ({ fullPage = false }) => {
  const [title, setTitle] = useState(generateRandomTitle());
  const [titleFocused, setTitleFocused] = useState(false);
  const [description, setDescription] = useState('Created with WebBuilder AI Live Editor');
  const [activeTab, setActiveTab] = useState('html');
  const [htmlCode, setHtmlCode] = useState(defaultHtmlCode);
  const [cssCode, setCssCode] = useState(defaultCssCode);
  const [jsCode, setJsCode] = useState(defaultJsCode);
  const [isFullScreenPreview, setIsFullScreenPreview] = useState(false);
  const [isDirty, setIsDirty] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [website, setWebsite] = useState(null);
  const navigate = useNavigate();

  // Set the dirty flag when code changes
  useEffect(() => {
    setIsDirty(true);
  }, [htmlCode, cssCode, jsCode]);

  const generatePreviewContent = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>${jsCode}</script>
        </body>
      </html>
    `;
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // If we already have a saved website, update it
      if (website && website._id) {
        await axios.put(`${API_BASE_URL}/api/websites/${website._id}`, {
          title,
          description,
          htmlCode,
          cssCode,
          jsCode
        });
        toast.success('Website updated successfully');
      } else {
        // Otherwise create a new website
        const response = await axios.post(`${API_BASE_URL}/api/websites`, {
          title,
          description,
          prompt: 'Created in Live Editor',
          htmlCode,
          cssCode,
          jsCode,
          isPublic: false
        });
        setWebsite(response.data);
        toast.success('Website saved successfully');
      }
      
      setIsDirty(false);
    } catch (error) {
      console.error('Error saving website:', error);
      toast.error('Failed to save website');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    try {
      const zip = new JSZip();
      
      // Add files to the zip
      zip.file("index.html", htmlCode);
      zip.file("styles.css", cssCode);
      if (jsCode?.trim()) {
        zip.file("script.js", jsCode);
      }
      
      // Generate the zip file
      zip.generateAsync({ type: "blob" }).then(function(content) {
        // Save the zip file
        saveAs(content, `${title.replace(/\s+/g, '-').toLowerCase()}.zip`);
      });
      
      toast.success('Files downloaded successfully');
    } catch (error) {
      console.error('Error downloading files:', error);
      toast.error('Failed to download files');
    }
  };

  const handleCopyCode = (code, type) => {
    navigator.clipboard.writeText(code);
    toast.success(`${type} code copied to clipboard`);
  };

  const toggleFullScreenPreview = () => {
    setIsFullScreenPreview(!isFullScreenPreview);
  };

  const handleToggleEditorMode = () => {
    if (fullPage) {
      navigate('/live-editor');
    } else {
      navigate('/full-editor');
    }
  };

  // Content to render inside or outside dashboard layout
  const editorContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`h-full ${fullPage ? 'h-screen' : ''}`}
    >
      <div className={`bg-white shadow-sm ${fullPage ? 'rounded-none border-b' : 'rounded-lg mb-4'} p-${fullPage ? '2' : '4'} ${fullPage ? '' : 'max-w-7xl mx-auto'}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="mb-2 sm:mb-0 flex items-center">
            {fullPage && (
              <button
                onClick={() => navigate('/live-editor')}
                className="mr-3 text-gray-600 hover:text-primary"
              >
                <FaArrowLeft className="text-lg" />
              </button>
            )}
            <div className="relative">
              <div className="flex items-center">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={() => setTitleFocused(true)}
                  onBlur={() => setTitleFocused(false)}
                  className={`text-xl font-bold text-gray-900 border-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 bg-transparent p-1 rounded ${titleFocused ? 'bg-blue-50' : ''} transition-all duration-200`}
                  placeholder="Enter website title"
                />
                <FaPencilAlt className={`ml-2 text-gray-400 ${titleFocused ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`} />
              </div>
              {!titleFocused && (
                <p className="text-xs text-gray-500 mt-1">Click to edit title</p>
              )}
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-gray-600 mt-2 border-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 bg-transparent p-0 w-full hover:bg-gray-50 rounded p-1"
                placeholder="Enter website description (optional)"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleToggleEditorMode}
              className="flex items-center px-3 py-1.5 text-xs bg-gray-600 text-white hover:bg-gray-700 rounded-md"
            >
              <FaDesktop className="mr-1" /> {fullPage ? 'Dashboard View' : 'Full-Page View'}
            </button>

            <button
              onClick={handleSave}
              disabled={!isDirty || saving}
              className={`flex items-center px-3 py-1.5 text-xs rounded-md
                ${isDirty 
                  ? 'bg-primary text-white hover:bg-secondary' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              {saving ? <LoadingSpinner size="xs" className="mr-1" /> : <FaSave className="mr-1" />}
              Save
            </button>
            
            <button
              onClick={handleDownload}
              className="flex items-center px-3 py-1.5 text-xs bg-blue-600 text-white hover:bg-blue-700 rounded-md"
            >
              <FaDownload className="mr-1" /> Download
            </button>
            
            {website && (
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center px-3 py-1.5 text-xs bg-purple-600 text-white hover:bg-purple-700 rounded-md"
              >
                <FaShareAlt className="mr-1" /> Share
              </button>
            )}
            
            <button
              onClick={toggleFullScreenPreview}
              className="flex items-center px-3 py-1.5 text-xs bg-green-600 text-white hover:bg-green-700 rounded-md"
            >
              {isFullScreenPreview ? <FaCompress className="mr-1" /> : <FaExpand className="mr-1" />}
              {isFullScreenPreview ? 'Exit Preview' : 'Full Preview'}
            </button>
          </div>
        </div>
      </div>

      <div className={`
        ${fullPage ? 'px-0 h-[calc(100vh-56px)]' : 'max-w-7xl mx-auto h-[calc(100vh-230px)]'} 
        grid ${isFullScreenPreview ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} 
        gap-${fullPage ? '0' : '4'}
      `}>
        {!isFullScreenPreview && (
          <div className={`bg-white ${fullPage ? 'rounded-none border-r' : 'rounded-lg shadow-sm'} overflow-hidden`}>
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('html')}
                  className={`px-4 py-2 text-sm font-medium ${activeTab === 'html' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <FaCode className="inline mr-1" /> HTML
                </button>
                <button
                  onClick={() => setActiveTab('css')}
                  className={`px-4 py-2 text-sm font-medium ${activeTab === 'css' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <FaCode className="inline mr-1" /> CSS
                </button>
                <button
                  onClick={() => setActiveTab('javascript')}
                  className={`px-4 py-2 text-sm font-medium ${activeTab === 'javascript' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <FaCode className="inline mr-1" /> JavaScript
                </button>
              </nav>
            </div>
            
            <div className={`${fullPage ? 'p-0' : 'p-1'}`}>
              {activeTab === 'html' && (
                <div className="relative">
                  <CodeEditor
                    language="html"
                    value={htmlCode}
                    onChange={setHtmlCode}
                    options={fullPage ? { 
                      fontSize: 15,
                      padding: { top: 10 }
                    } : {}}
                  />
                  <button
                    onClick={() => handleCopyCode(htmlCode, 'HTML')}
                    className="absolute top-2 right-2 bg-gray-700 text-white p-1 rounded opacity-70 hover:opacity-100"
                    title="Copy HTML"
                  >
                    <FaCopy />
                  </button>
                </div>
              )}
              
              {activeTab === 'css' && (
                <div className="relative">
                  <CodeEditor
                    language="css"
                    value={cssCode}
                    onChange={setCssCode}
                  />
                  <button
                    onClick={() => handleCopyCode(cssCode, 'CSS')}
                    className="absolute top-2 right-2 bg-gray-700 text-white p-1 rounded opacity-70 hover:opacity-100"
                    title="Copy CSS"
                  >
                    <FaCopy />
                  </button>
                </div>
              )}
              
              {activeTab === 'javascript' && (
                <div className="relative">
                  <CodeEditor
                    language="javascript"
                    value={jsCode}
                    onChange={setJsCode}
                  />
                  <button
                    onClick={() => handleCopyCode(jsCode, 'JavaScript')}
                    className="absolute top-2 right-2 bg-gray-700 text-white p-1 rounded opacity-70 hover:opacity-100"
                    title="Copy JavaScript"
                  >
                    <FaCopy />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className={`bg-white ${fullPage ? 'rounded-none' : 'rounded-lg shadow-sm'} overflow-hidden`}>
          <div className="border-b border-gray-200 flex justify-between items-center">
            <h2 className="px-4 py-2 text-sm font-medium text-gray-900">
              <FaEye className="inline mr-1" /> Preview
            </h2>
          </div>
          <div className={`${fullPage ? 'p-0' : 'p-1'} h-full`}>
            <iframe 
              title="Preview"
              srcDoc={generatePreviewContent()}
              className={`w-full ${fullPage ? 'h-[calc(100vh-90px)]' : 'h-[calc(100%-10px)]'} border-none`}
              sandbox="allow-scripts allow-modals"
            />
          </div>
        </div>
      </div>

      {showShareModal && website && (
        <ShareModal 
          onClose={() => setShowShareModal(false)} 
          website={website} 
        />
      )}
    </motion.div>
  );

  // If full page mode, don't use the dashboard layout
  if (fullPage) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-hidden p-0">
        {editorContent}
      </div>
    );
  }

  return <DashboardLayout>{editorContent}</DashboardLayout>;
};

export default LiveEditorPage;
