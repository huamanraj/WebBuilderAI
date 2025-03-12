import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaSort, FaFilter, FaTh, FaList } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import WebsiteCard from '../../components/dashboard/WebsiteCard';
import EmptyState from '../../components/dashboard/EmptyState';
import Pagination from '../../components/dashboard/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MyWebsitesPage = () => {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  const [filters, setFilters] = useState({
    sortBy: 'newest',
    viewMode: 'grid'
  });
  
  useEffect(() => {
    fetchWebsites();
  }, [pagination.page, filters.sortBy]);

  const fetchWebsites = async (search = '') => {
    try {
      setLoading(true);
      let endpoint = `/api/websites?page=${pagination.page}&limit=9`;
      
      if (filters.sortBy === 'oldest') {
        endpoint += '&sort=oldest';
      }
      
      if (search) {
        endpoint = `/api/websites/search?query=${search}&page=1&limit=9`;
      }
      
      const response = await axios.get(endpoint);
      setWebsites(response.data.websites);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching websites:', error);
      toast.error('Failed to load your websites');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWebsites(searchTerm);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleSortChange = (e) => {
    setFilters(prev => ({ ...prev, sortBy: e.target.value }));
  };

  const handleViewModeChange = (mode) => {
    setFilters(prev => ({ ...prev, viewMode: mode }));
  };

  const handleWebsiteDelete = async (id) => {
    // Remove the website from the current list
    setWebsites(prev => prev.filter(website => website._id !== id));
    
    // Update the total count
    setPagination(prev => ({
      ...prev,
      total: Math.max(0, prev.total - 1),
      pages: Math.max(1, Math.ceil((prev.total - 1) / 9))
    }));
    
    // If we're on a page that no longer has items, go to the previous page
    if (websites.length === 1 && pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Websites</h1>
          <p className="text-gray-600 mt-2">
            Manage, edit, and organize all your generated websites.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <form onSubmit={handleSearch} className="flex w-full md:w-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search websites..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-md focus:ring-primary focus:border-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
              </div>
              <button
                type="submit"
                className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-r-md transition-colors"
              >
                Search
              </button>
            </form>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative">
                <select
                  className="pl-10 pr-10 py-2 border border-gray-300 rounded-md appearance-none bg-white focus:ring-primary focus:border-primary"
                  value={filters.sortBy}
                  onChange={handleSortChange}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSort className="text-gray-400" />
                </div>
              </div>
              
              <div className="flex border border-gray-300 rounded-md bg-white">
                <button
                  onClick={() => handleViewModeChange('grid')}
                  className={`px-3 py-2 ${filters.viewMode === 'grid' 
                    ? 'text-primary bg-blue-50' 
                    : 'text-gray-500 hover:bg-gray-100'}`}
                  title="Grid view"
                >
                  <FaTh />
                </button>
                <button
                  onClick={() => handleViewModeChange('list')}
                  className={`px-3 py-2 ${filters.viewMode === 'list' 
                    ? 'text-primary bg-blue-50' 
                    : 'text-gray-500 hover:bg-gray-100'}`}
                  title="List view"
                >
                  <FaList />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Website List */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : websites?.length > 0 ? (
            <>
              <div className={`grid ${filters.viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'} gap-6`}
              >
                {websites.map((website) => (
                  <WebsiteCard 
                    key={website._id} 
                    website={website} 
                    viewMode={filters.viewMode}
                    onDelete={handleWebsiteDelete}
                  />
                ))}
              </div>
              
              {pagination.pages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.pages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="No websites found"
              description={searchTerm 
                ? "No websites match your search criteria." 
                : "You haven't created any websites yet."}
              actionLink="/create"
              actionText="Create Website"
            />
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default MyWebsitesPage;
