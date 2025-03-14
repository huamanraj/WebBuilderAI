import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaLightbulb, FaRandom, FaBrain } from 'react-icons/fa';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Get the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Configure axios with default settings
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 2 minute timeout for generator
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

const CreateWebsitePage = () => {
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [examplePrompts, setExamplePrompts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExamplePrompts();
  }, []);

  const fetchExamplePrompts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/generator/examples`);
      setExamplePrompts(response.data.examplePrompts);
    } catch (error) {
      console.error('Error fetching example prompts:', error);
    }
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    if (!title) {
      // Automatically set a title based on the first few words of the prompt
      const words = e.target.value.split(' ').slice(0, 5).join(' ');
      setTitle(words ? `${words}...` : '');
    }
  };

  const handleExampleClick = (example) => {
    setPrompt(example);
    setShowExamples(false);
    // Set a title based on the first few words
    const words = example.split(' ').slice(0, 5).join(' ');
    setTitle(words ? `${words}...` : '');
  };

  const handleGetRandomExample = () => {
    if (examplePrompts.length > 0) {
      const randomIndex = Math.floor(Math.random() * examplePrompts.length);
      handleExampleClick(examplePrompts[randomIndex]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt) {
      toast.error('Please enter a description for your website');
      return;
    }
    
    if (!title) {
      toast.error('Please enter a title for your website');
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // Step 1: Generate website code with retry logic
      let generatorResponse;
      try {
        // First try with axios client with CORS credentials
        generatorResponse = await apiClient.post('/api/generator/generate', { prompt });
      } catch (generatorError) {
        console.log('First generator attempt failed:', generatorError);
        
        // Fallback: Try without credentials if CORS is the issue
        generatorResponse = await axios.post(`${API_BASE_URL}/api/generator/generate`, { prompt }, {
          timeout: 120000,
          headers: {
            'Content-Type': 'application/json',
          }
        });
      }
      
      const { htmlCode, cssCode, jsCode } = generatorResponse.data;
      
      // Step 2: Save the website
      const websiteData = {
        title,
        description: description || prompt,
        prompt,
        htmlCode,
        cssCode,
        jsCode,
        isPublic: false
      };
      
      const saveResponse = await apiClient.post('/api/websites', websiteData);
      
      toast.success('Website generated successfully!');
      navigate(`/website/${saveResponse.data._id}`);
      
    } catch (error) {
      console.error('Error generating website:', error);
      
      if (error.response?.status === 429) {
        toast.error('Daily prompt limit reached. Try again tomorrow.');
      } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        toast.error('Request timed out. The generation process took too long.');
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to generate website. Please try again later.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6  mx-auto"
      >
        <div className="bg-white/60 backdrop-blur-sm border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Create New Website</h1>
              <p className="text-sm text-gray-500 mt-1">
                Let AI generate a website based on your description
              </p>
            </div>
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 hover:bg-gray-100 h-9 px-4"
            >
              <FaLightbulb className="mr-2 h-4 w-4" />
              {showExamples ? 'Hide Examples' : 'Show Examples'}
            </button>
          </div>

          {showExamples && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 bg-blue-50 p-4 rounded-lg"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-900">Example Prompts</h3>
                <button
                  onClick={handleGetRandomExample}
                  className="flex items-center text-sm text-primary hover:text-secondary"
                >
                  <FaRandom className="mr-1" /> Get Random Example
                </button>
              </div>
              <div className="grid gap-2">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    className="text-left p-2 hover:bg-blue-100 rounded text-sm text-gray-700"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Website Title
              </label>
              <input
                id="title"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Enter a title for your website"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <input
                id="description"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Enter a brief description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                Your Website Description
              </label>
              <textarea
                id="prompt"
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Describe the website you want in detail. Include information about layout, colors, features, content, and any specific requirements."
                value={prompt}
                onChange={handlePromptChange}
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isGenerating}
                className="flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" /> Generating Website...
                  </>
                ) : (
                  <>
                    <FaBrain className="mr-2" /> Generate Website
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {isGenerating && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center justify-center py-4">
              <h2 className="text-xl font-semibold text-gray-900">Generating Your Website</h2>
              <p className="text-gray-600 mb-6 text-center">
                Our AI is creating your website based on your description.
                This may take 15-30 seconds.
              </p>
              
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Code skeleton section */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center mb-3">
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                    <div className="ml-2 text-sm font-mono text-gray-700">index.html</div>
                  </div>
                  <div className="font-mono text-xs text-gray-600 space-y-1 overflow-hidden">
                    <div className="flex">
                      <span className="text-gray-400 mr-2">1</span>
                      <span className="text-blue-600">&lt;!DOCTYPE html&gt;</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-400 mr-2">2</span>
                      <span className="text-blue-600">&lt;html lang=<span className="text-green-600">"en"</span>&gt;</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-400 mr-2">3</span>
                      <span className="text-blue-600">&lt;head&gt;</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-400 mr-2">4</span>
                      <span className="pl-4 text-blue-600">&lt;meta charset=<span className="text-green-600">"UTF-8"</span>&gt;</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-400 mr-2">5</span>
                      <span className="pl-4 text-blue-600">&lt;title&gt;</span>
                      <span className="text-gray-900 animate-pulse">{title || 'Loading...'}</span>
                      <span className="text-blue-600">&lt;/title&gt;</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-400 mr-2">6</span>
                      <span className="text-blue-600">&lt;/head&gt;</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-400 mr-2">7</span>
                      <span className="text-blue-600">&lt;body&gt;</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-400 mr-2">8</span>
                      <span className="pl-4 text-blue-600">&lt;header&gt;</span>
                    </div>
                    <div className="h-2 w-3/4 bg-gray-300 animate-pulse rounded my-1 ml-10"></div>
                    <div className="h-2 w-1/2 bg-gray-300 animate-pulse rounded my-1 ml-10"></div>
                    <div className="flex">
                      <span className="text-gray-400 mr-2">11</span>
                      <span className="pl-4 text-blue-600">&lt;/header&gt;</span>
                    </div>
                  </div>
                </div>
                
                {/* Website preview mockup */}
                <div className="bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
                  <div className="w-full h-6 bg-gray-100 rounded-t-lg flex items-center px-2 border-b">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                      <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                      <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                    </div>
                    <div className="mx-auto h-4 w-36 bg-gray-200 rounded"></div>
                  </div>
                  <div className="p-2">
                    {/* Header */}
                    <div className="h-10 w-full bg-gray-200 rounded-md mb-3 animate-pulse"></div>
                    {/* Navigation */}
                    <div className="h-6 w-full flex space-x-2 mb-4">
                      <div className="h-full w-16 bg-gray-200 rounded-md animate-pulse"></div>
                      <div className="h-full w-16 bg-gray-200 rounded-md animate-pulse"></div>
                      <div className="h-full w-16 bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                    {/* Hero section */}
                    <div className="h-32 w-full bg-gray-200 rounded-md mb-4 flex items-center justify-center animate-pulse">
                      <div className="h-12 w-36 bg-gray-300 rounded-md"></div>
                    </div>
                    {/* Content sections */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="h-20 bg-gray-200 rounded-md animate-pulse"></div>
                      <div className="h-20 bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                    <div className="h-24 w-full bg-gray-200 rounded-md animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex items-center">
                <LoadingSpinner size="sm" className="mr-2" />
                <span className="text-gray-600">Processing your request...</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default CreateWebsitePage;
