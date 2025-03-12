import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCode } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import MainLayout from '../../layouts/MainLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const SharedWebsitePage = () => {
  const { shareableLink } = useParams();
  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSourceCode, setShowSourceCode] = useState(false);

  useEffect(() => {
    fetchWebsite();
  }, [shareableLink]);

  const fetchWebsite = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/websites/share/${shareableLink}`);
      setWebsite(response.data);
    } catch (error) {
      console.error('Error fetching website:', error);
      toast.error('This website is not available or has been made private');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!website) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Website Not Found</h1>
            <p className="text-gray-600 mb-6">This website doesn't exist or has been made private by its creator.</p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary"
            >
              <FaArrowLeft className="mr-2" /> Back to Home
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Construct the full HTML document
  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>${website.cssCode}</style>
      </head>
      <body>
        ${website.htmlCode}
        <script>${website.jsCode}</script>
      </body>
    </html>
  `;

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{website.title}</h1>
                {website.description && (
                  <p className="text-gray-600 mt-1">{website.description}</p>
                )}
              </div>

              <div className="mt-4 sm:mt-0 flex items-center">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-primary mr-4"
                >
                  <span className="flex items-center">
                    <FaArrowLeft className="mr-1" /> Back to Home
                  </span>
                </Link>
                <button
                  onClick={() => setShowSourceCode(!showSourceCode)}
                  className="flex items-center px-3 py-1.5 text-xs bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md"
                >
                  <FaCode className="mr-1" /> {showSourceCode ? 'Hide Code' : 'View Code'}
                </button>
              </div>
            </div>
          </div>

          {showSourceCode ? (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex mb-4 border-b">
                <button
                  className={`px-4 py-2 ${!showSourceCode ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                  onClick={() => setShowSourceCode(false)}
                >
                  Preview
                </button>
                <button
                  className={`px-4 py-2 ${showSourceCode ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                  onClick={() => setShowSourceCode(true)}
                >
                  Source Code
                </button>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm font-mono overflow-auto max-h-[70vh]">
                  {fullHtml}
                </pre>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ minHeight: '70vh' }}>
              <iframe
                srcDoc={fullHtml}
                title={website.title}
                className="w-full h-[70vh] border-none"
                sandbox="allow-scripts"
              />
            </div>
          )}
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default SharedWebsitePage;
