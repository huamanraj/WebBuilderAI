import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash, FaShareAlt } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';

const WebsiteCard = ({ website, viewMode = 'grid' }) => {
  const { _id, title, description, createdAt, prompt } = website;
  const [thumbnailUrl, setThumbnailUrl] = useState(website.thumbnail || 'https://www.designbombs.com/wp-content/uploads/2017/02/make-a-website.jpg');

  useEffect(() => {
    // Fetch image based on website title
    const fetchThumbnail = async () => {
      if (!website.thumbnail && title) {
        try {
          const response = await axios.get(`/api/images?query=${encodeURIComponent(title)}`);
          if (response.data && response.data.images && response.data.images.length > 0) {
            setThumbnailUrl(response.data.images[0].url);
          }
        } catch (error) {
          console.error('Error fetching thumbnail:', error);
        }
      }
    };

    fetchThumbnail();
  }, [title, website.thumbnail]);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm('Are you sure you want to delete this website?')) {
      try {
        await axios.delete(`/api/websites/${_id}`);
        toast.success('Website deleted successfully');
        // You might need to refresh the list after deletion
      } catch (error) {
        toast.error('Failed to delete website');
        console.error('Error deleting website:', error);
      }
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Copy the share link to clipboard
    const shareUrl = `${window.location.origin}/share/${website.shareableLink}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group bg-white/60 backdrop-blur-sm border rounded-lg overflow-hidden hover:shadow-lg transition-all ${
        viewMode === 'list' ? 'flex items-center' : ''
      }`}
    >
      <div className={`relative aspect-video bg-gray-100 ${viewMode === 'list' ? 'w-48' : ''}`}>
        <img
          src={thumbnailUrl}
          alt={title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x200?text=Preview+Not+Available';
          }}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1 p-4">
        <h3 className="font-medium tracking-tight text-gray-900 truncate">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
          <div className="flex items-center gap-2">
            {/* Action buttons with modern styling */}
            <button
              onClick={handleShare}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 hover:bg-gray-100 h-8 px-3"
            >
              <FaShareAlt className="h-4 w-4" />
            </button>
            <Link
              to={`/website/${_id}`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 hover:bg-gray-100 h-8 px-3"
            >
              <FaEdit className="h-4 w-4" />
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 hover:bg-gray-100 h-8 px-3"
            >
              <FaTrash className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WebsiteCard;
