import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [usageSummary, setUsageSummary] = useState({
    totalWebsites: 0,
    dailyPromptsUsed: 0,
    dailyPromptsLimit: 2,
    lastActivity: null
  });

  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
      
      // Fetch user's statistics
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      // For now we only have the prompt usage in the user object
      setUsageSummary({
        totalWebsites: 0, // This would come from the API
        dailyPromptsUsed: user?.promptsUsedToday || 0,
        dailyPromptsLimit: 10,
        lastActivity: null // This would come from the API
      });
      
      // Get website count
      const websitesResponse = await axios.get('/api/websites?limit=1');
      if (websitesResponse.data.pagination) {
        setUsageSummary(prev => ({
          ...prev,
          totalWebsites: websitesResponse.data.pagination.total || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, you would have an API endpoint for this
      // const response = await axios.put('/api/users/profile', {
      //   name: profileData.name,
      //   currentPassword: profileData.currentPassword,
      //   newPassword: profileData.newPassword || undefined
      // });
      
      // Mock a successful response for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Profile updated successfully');
      setEditMode(false);
      setProfileData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        setLoading(true);
        // In a real app, you would have an API endpoint for this
        // await axios.delete('/api/users/account');
        
        // Mock a successful response for now
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast.success('Account deleted successfully');
        logout(); // Log the user out after account deletion
      } catch (error) {
        console.error('Error deleting account:', error);
        toast.error('Failed to delete account');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpgradeClick = () => {
    toast.info('Pro plan coming soon!');
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your account information and password.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center text-primary hover:text-secondary"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      disabled={!editMode}
                      className={`pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md ${
                        !editMode ? 'bg-gray-50 text-gray-500' : 'bg-white'
                      } focus:ring-primary focus:border-primary`}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      disabled={true} // Email is not editable
                      className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md bg-gray-50 text-gray-500 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                {editMode && (
                  <>
                    <div className="mb-4">
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={profileData.currentPassword}
                          onChange={handleChange}
                          className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password (optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={profileData.newPassword}
                          onChange={handleChange}
                          className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={profileData.confirmPassword}
                          onChange={handleChange}
                          className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                          disabled={!profileData.newPassword}
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70"
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <LoadingSpinner size="sm" className="mr-2" /> Saving...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <FaCheck className="mr-2" /> Save Changes
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditMode(false);
                          setProfileData((prev) => ({
                            ...prev,
                            name: user?.name || '',
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          }));
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        <span className="flex items-center">
                          <FaTimes className="mr-2" /> Cancel
                        </span>
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>

            {/* Delete Account */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Danger Zone</h2>
              <p className="text-gray-600 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70"
              >
                {loading ? 'Processing...' : 'Delete Account'}
              </button>
            </div>
          </div>

          {/* Account Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Summary</h2>
              
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="text-base font-medium text-gray-900">Free Plan</p>
                </div>

                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-base font-medium text-gray-900">
                    {user?.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString() 
                      : new Date().toLocaleDateString()}
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">Total Websites</p>
                  <p className="text-base font-medium text-gray-900">
                    {usageSummary.totalWebsites}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Daily Prompts Usage</p>
                  <div className="mt-2">
                    <div className="bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, (usageSummary.dailyPromptsUsed / usageSummary.dailyPromptsLimit) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {usageSummary.dailyPromptsUsed} of {usageSummary.dailyPromptsLimit} prompts used today
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleUpgradeClick}
                  className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default ProfilePage;
