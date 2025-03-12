import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaCopy, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const ShareModal = ({ onClose, website }) => {
  const [isPublic, setIsPublic] = useState(website?.isPublic || false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const shareUrl = `${window.location.origin}/share/${website.shareableLink}`;
  
  const handleToggleVisibility = async () => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/websites/${website._id}`, { isPublic: !isPublic });
      setIsPublic(!isPublic);
      toast.success(isPublic 
        ? 'Website is now private' 
        : 'Website is now public and shareable'
      );
    } catch (error) {
      toast.error('Failed to update website visibility');
      console.error('Error updating visibility:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard');
  };
  
  // Close on escape key press
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Share Website</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">Public Link</label>
            <button
              onClick={handleToggleVisibility}
              disabled={isUpdating}
              className={`flex items-center ${isUpdating ? 'opacity-70 cursor-not-allowed' : 'hover:text-primary'}`}
            >
              {isPublic ? (
                <FaToggleOn className="text-primary text-2xl" />
              ) : (
                <FaToggleOff className="text-gray-400 text-2xl" />
              )}
            </button>
          </div>
          
          {isPublic ? (
            <div className="mt-2 flex">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm text-gray-800 focus:outline-none"
              />
              <button
                onClick={copyToClipboard}
                className="px-3 py-2 bg-primary text-white rounded-r-md hover:bg-secondary"
              >
                <FaCopy />
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-2">
              Enable public sharing to generate a shareable link.
            </p>
          )}
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600 mb-4">
          <p>
            <strong>Note:</strong> When public sharing is enabled, anyone with the link can view your website.
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ShareModal;
