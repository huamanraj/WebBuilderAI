import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

const EmptyState = ({ title, description, actionLink, actionText }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="bg-gray-100 rounded-full p-4 mb-4">
        <FaPlus className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-500 max-w-md">{description}</p>
      {actionLink && actionText && (
        <Link
          to={actionLink}
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {actionText}
        </Link>
      )}
    </motion.div>
  );
};

export default EmptyState;
