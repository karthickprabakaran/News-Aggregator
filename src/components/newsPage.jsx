// NewsPage.jsx
import { useState, useEffect } from 'react';

function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const categories = [
    'all',
    'Politics',
    'Crime',
    'Education',
    'Sports',
    'Entertainment',
    'Infrastructure',
    'Environment',
    'Health',
    'General'
  ];

  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]); // Fetch news when page changes

  const fetchNews = async (page) => {
    try {
      setLoading(true);
      const API_URL = 'http://localhost:5008';
      const response = await fetch(`${API_URL}/api/news?page=${page}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.news && Array.isArray(data.news)) {
        setNews(data.news);
        setPagination(data.pagination);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(`Failed to fetch news: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Add pagination controls
  const PaginationControls = () => (
    <div className="flex justify-center items-center space-x-4 mt-8">
      <button
        onClick={() => setCurrentPage(prev => prev - 1)}
        disabled={!pagination?.hasPreviousPage}
        className={`px-4 py-2 rounded-md ${
          pagination?.hasPreviousPage
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Previous
      </button>
      
      <span className="text-gray-600">
        Page {pagination?.currentPage} of {pagination?.totalPages}
      </span>
      
      <button
        onClick={() => setCurrentPage(prev => prev + 1)}
        disabled={!pagination?.hasNextPage}
        className={`px-4 py-2 rounded-md ${
          pagination?.hasNextPage
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Next
      </button>
    </div>
  );

  // Your existing render logic
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header and category filters remain the same */}
      
      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Your existing news card rendering logic */}
      </div>

      {/* Add pagination controls */}
      {!loading && !error && <PaginationControls />}
    </div>
  );
}

export default NewsPage;