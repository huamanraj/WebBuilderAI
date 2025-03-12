import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlus, FaSearch, FaSort, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import WebsiteCard from '../../components/dashboard/WebsiteCard';
import EmptyState from '../../components/dashboard/EmptyState';
import Pagination from '../../components/dashboard/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DashboardPage = () => {
  const { user } = useAuth();
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  const [sortOrder, setSortOrder] = useState('newest');
  
  useEffect(() => {
    fetchWebsites();
  }, [pagination.page, sortOrder]);

  const fetchWebsites = async (search = '') => {
    try {
      setLoading(true);
      let endpoint = `/api/websites?page=${pagination.page}&limit=6`;
      
      if (sortOrder === 'oldest') {
        endpoint += '&sort=oldest';
      }
      
      if (search) {
        endpoint = `/api/websites/search?query=${search}&page=1&limit=6`;
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
    setSortOrder(e.target.value);
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Welcome Section */}
        <div className="bg-white/50 backdrop-blur-sm border rounded-lg p-6">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900">Welcome, {user?.name || 'User'}</h2>
          <p className="text-muted-foreground mt-2">
            Create new websites, manage your existing projects, and track your usage.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/create"
            className="bg-white hover:bg-gray-50 border rounded-lg p-6 transition-all hover:shadow-md flex flex-col items-center justify-center text-center group"
          >
            <FaPlus className="text-3xl mb-3 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-900">New Website</span>
            <p className="text-sm text-muted-foreground mt-2">Generate a new website with AI</p>
          </Link>

          <div className="bg-white/50 backdrop-blur-sm border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground">Websites Created</h3>
            <p className="text-3xl font-semibold mt-2 text-gray-900">{pagination.total || 0}</p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground">Daily Prompts</h3>
            <p className="text-3xl font-semibold mt-2 text-gray-900">
              {user?.promptsUsedToday || 0}
              <span className="text-muted-foreground text-base font-normal">/2</span>
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground">Last Built</h3>
            <p className="text-lg font-medium mt-2 text-gray-900">
              {websites?.length > 0 
                ? new Date(websites[0].createdAt).toLocaleDateString() 
                : 'No websites yet'}
            </p>
          </div>
        </div>

        {/* My Websites Section */}
        <div className="bg-white/50 backdrop-blur-sm border rounded-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2 sm:mb-0">My Websites</h2>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search websites..."
                    className="w-full pl-10 pr-3 py-2 bg-white border rounded-l-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-muted-foreground" />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-r-md transition-colors"
                >
                  Search
                </button>
              </form>
              
              <div className="flex w-full sm:w-auto">
                <div className="relative flex-grow">
                  <select
                    className="w-full pl-10 pr-3 py-2 bg-white border rounded-md appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    value={sortOrder}
                    onChange={handleSortChange}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSort className="text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : websites?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {websites.map((website) => (
                  <WebsiteCard key={website._id} website={website} />
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
              title="No websites yet"
              description="Start by creating your first website with AI."
              actionLink="/create"
              actionText="Create Website"
            />
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default DashboardPage;
