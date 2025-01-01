import { useState, useEffect, useCallback, memo } from 'react';
import { Newspaper, AlertCircle, ChevronRight, Heart } from 'lucide-react';
import Cookies from 'js-cookie';

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

const NewsCard = memo(({ newsItem, likedPosts, onLike }) => {
  const handleLike = async () => {
    // Check if the post is already liked
    if (likedPosts.includes(newsItem.id)) {
      console.warn('Post already liked:', newsItem.id);
      return; // Exit if already liked
    }

    // Update cookies and state for liked posts
    const likedPostsFromCookies = Cookies.get('likedPosts') ? JSON.parse(Cookies.get('likedPosts')) : [];
    likedPostsFromCookies.push(newsItem.id);
    Cookies.set('likedPosts', JSON.stringify(likedPostsFromCookies), { expires: 30 });

    // Send the liked post details to the backend
    try {
      const response = await fetch('http://localhost:5009/api/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: newsItem.id, title: newsItem.title, description: newsItem.description }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Successfully liked post:', data);

      // Notify parent to update liked posts
      onLike(newsItem.id);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const isLiked = likedPosts.includes(newsItem.id);

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 mb-8 max-w-3xl mx-auto overflow-hidden border border-gray-200 dark:border-gray-700 transform hover:-translate-y-1">
      <div className="p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">
            {newsItem.source || 'News Source'}
          </span>
          <span className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold px-4 py-2 rounded-full capitalize">
            {newsItem.category}
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {newsItem.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg mb-6 leading-relaxed line-clamp-3">
          {newsItem.description}
        </p>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {formatDate(newsItem.published)}
          </span>

          <a
            href={newsItem.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Read more
            <ChevronRight className="w-4 h-4 ml-2" />
          </a>
        </div>

        {/* Like Icon */}
        <div className="mt-4 flex items-center">
          <Heart
            onClick={handleLike}
            className={`cursor-pointer w-6 h-6 ${isLiked ? 'text-red-600' : 'text-gray-400 hover:text-red-500'} transition-colors duration-300`}
          />
          <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-300">
            {isLiked ? 'Liked' : 'Like'}
          </span>
        </div>
      </div>
    </div>
  );
});

function NewsPage() {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [likedPosts, setLikedPosts] = useState([]);
  const [suggestedNews, setSuggestedNews] = useState([]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5009/api/categories');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log('Fetched categories:', data);
      setCategories(data.categories);
      if (data.categories.length > 0) {
        setSelectedCategory(data.categories[0]); // Set default category
      }
    } catch (error) {
      setError(error.message);
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  const fetchNews = useCallback(async (pageNum, category) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5009/api/news?page=${pageNum}&limit=20&category=${category}`
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setNews((prev) => (pageNum === 1 ? data.news : [...prev, ...data.news]));
      setHasMore(data.hasMore);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSuggestedNews = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5009/api/suggested-news');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setSuggestedNews(data.suggestedNews);
    } catch (error) {
      console.error('Failed to fetch suggested news:', error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    // Get liked posts from cookies
    const likedPostsFromCookies = Cookies.get('likedPosts') ? JSON.parse(Cookies.get('likedPosts')) : [];
    setLikedPosts(likedPostsFromCookies);
  }, []); // Run only once on component mount

  useEffect(() => {
    setPage(1);
    setNews([]);
    setHasMore(true);
    fetchNews(1, selectedCategory);
    fetchSuggestedNews();
  }, [selectedCategory, fetchNews, fetchSuggestedNews]);

  useEffect(() => {
    if (page > 1) {
      fetchNews(page, selectedCategory);
    }
  }, [page, selectedCategory, fetchNews]);

  const handlePostLike = (postId) => {
    setLikedPosts((prev) => [...prev, postId]); // Update liked posts state
    fetchSuggestedNews(); // Refetch suggested news after liking a post
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <Newspaper className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                News Feed
              </h1>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-48 px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-all duration-300"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-6 mb-8 rounded-xl">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {error}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {news.map((newsItem) => (
            <NewsCard 
              key={newsItem.id} 
              newsItem={newsItem} 
              likedPosts={likedPosts} 
              onLike={handlePostLike} 
            />
          ))}
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        )}

        {!hasMore && !loading && news.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              You've reached the end of the news feed
            </p>
          </div>
        )}

        {!loading && news.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              No news found for this category
            </p>
          </div>
        )}

        {/* Suggested News Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Suggested News</h2>
          {suggestedNews.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No suggestions available based on your likes.</p>
          ) : (
            <div className="space-y-8">
              {suggestedNews.map((newsItem) => (
                <NewsCard 
                  key={newsItem.id} 
                  newsItem={newsItem} 
                  likedPosts={likedPosts} 
                  onLike={handlePostLike} 
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default NewsPage;