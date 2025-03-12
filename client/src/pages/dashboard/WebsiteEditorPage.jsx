import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { FaCode, FaEye, FaSave, FaDownload, FaCopy, FaShareAlt, FaExpand, FaCompress, FaArrowLeft } from 'react-icons/fa';
import DashboardLayout from '../../layouts/DashboardLayout';
import CodeEditor from '../../components/editor/CodeEditor';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ShareModal from '../../components/modals/ShareModal';

const WebsiteEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('html');
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [isFullScreenPreview, setIsFullScreenPreview] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetchWebsite();
  }, [id]);

  const fetchWebsite = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/websites/${id}`);
      setWebsite(response.data);
      setHtmlCode(response.data.htmlCode);
      setCssCode(response.data.cssCode);
      setJsCode(response.data.jsCode);
    } catch (error) {
      console.error('Error fetching website:', error);
      toast.error('Failed to load website');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (website) {
      setIsDirty(
        htmlCode !== website.htmlCode ||
        cssCode !== website.cssCode ||
        jsCode !== website.jsCode
      );
    }
  }, [htmlCode, cssCode, jsCode, website]);

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

  useEffect(() => {
    if (!loading && (htmlCode || cssCode || jsCode)) {
      try {
        // Preview will update automatically through srcDoc
      } catch (error) {
        console.error('Preview error:', error);
        toast.error('Failed to update preview');
      }
    }
  }, [htmlCode, cssCode, jsCode, loading]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put(`/api/websites/${id}`, {
        htmlCode,
        cssCode,
        jsCode
      });
      toast.success('Website saved successfully');
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
        saveAs(content, `${website.title.replace(/\s+/g, '-').toLowerCase()}.zip`);
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-full"
      >
        <div className="bg-white shadow-sm rounded-lg mb-4 p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <div className="flex items-center">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="mr-3 text-gray-500 hover:text-primary"
                >
                  <FaArrowLeft />
                </button>
                <h1 className="text-xl font-bold text-gray-900">{website.title}</h1>
              </div>
              {website.description && (
                <p className="text-gray-600 mt-1">{website.description}</p>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
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
              
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center px-3 py-1.5 text-xs bg-purple-600 text-white hover:bg-purple-700 rounded-md"
              >
                <FaShareAlt className="mr-1" /> Share
              </button>
              
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

        <div className={`${isFullScreenPreview ? 'h-[calc(100vh-180px)]' : 'h-[calc(100vh-230px)]'} grid ${isFullScreenPreview ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-4`}>
          {!isFullScreenPreview && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
              
              <div className="p-1">
                {activeTab === 'html' && (
                  <div className="relative">
                    <CodeEditor
                      language="html"
                      value={htmlCode}
                      onChange={setHtmlCode}
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
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 flex justify-between items-center">
              <h2 className="px-4 py-2 text-sm font-medium text-gray-900">
                <FaEye className="inline mr-1" /> Preview
              </h2>
            </div>
            <div className="p-1 h-full">
              <iframe 
                title="Preview"
                srcDoc={generatePreviewContent()}
                className="w-full h-[calc(100%-10px)] border-none"
                sandbox="allow-scripts allow-modals"
              />
            </div>
          </div>
        </div>

        {showShareModal && (
          <ShareModal 
            onClose={() => setShowShareModal(false)} 
            website={website} 
          />
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default WebsiteEditorPage;
