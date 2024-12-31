import { useState, useEffect, useCallback, memo } from 'react';

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return dateString;
  }
};

const NewsCard = memo(({ newsItem }) => (
  <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 mb-6 max-w-2xl mx-auto overflow-hidden border border-gray-100">
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
          {newsItem.source || 'News Source'}
        </span>
        <span className="bg-gray-50 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
          {newsItem.category}
        </span>
      </div>

      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 leading-tight hover:text-blue-600 transition-colors duration-200">
        {newsItem.title}
      </h3>

      <p className="text-gray-600 text-base mb-4 leading-relaxed line-clamp-3">
        {newsItem.description}
      </p>

      <div className="flex items-center justify-between mt-6">
        <span className="text-sm text-gray-500">{formatDate(newsItem.published)}</span>

        <a
          href={newsItem.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
        >
          Read more
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </a>
      </div>
    </div>
  </div>
));

function NewsPage() {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5009/api/categories');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  const fetchNews = useCallback(async (pageNum, category) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5009/api/news?page=${pageNum}&limit=20&category=${category}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setNews((prev) => (pageNum === 1 ? data.news : [...prev, ...data.news]));
      setHasMore(data.hasMore);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setPage(1);
    setNews([]);
    setHasMore(true);
    fetchNews(1, selectedCategory);
  }, [selectedCategory, fetchNews]);

  useEffect(() => {
    if (page > 1) {
      fetchNews(page, selectedCategory);
    }
  }, [page, selectedCategory, fetchNews]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 100
    ) {
      if (hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    }
  }, [hasMore, loading]);

  useEffect(() => {
    const throttledScroll = () => {
      let timeout;
      return () => {
        if (!timeout) {
          timeout = setTimeout(() => {
            handleScroll();
            timeout = null;
          }, 100);
        }
      };
    };

    const throttled = throttledScroll();
    window.addEventListener('scroll', throttled);
    return () => window.removeEventListener('scroll', throttled);
  }, [handleScroll]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-800">News Feed</h1>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-40 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {news.map((newsItem) => (
            <NewsCard key={newsItem.id} newsItem={newsItem} />
          ))}
        </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {!hasMore && !loading && news.length > 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 text-sm font-medium">
              You've reached the end of the news feed
            </p>
          </div>
        )}

        {!loading && news.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 text-sm font-medium">
              No news found for this category
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default NewsPage;