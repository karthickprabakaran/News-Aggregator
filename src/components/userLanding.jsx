import React, { useState } from 'react';

const HomePage = () => {
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  const handleSearch = () => {
    // Logic to handle search based on location and category
    console.log(`Location: ${location}, Category: ${category}`);
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Welcome to NewsApp</h1>
        <p className="text-gray-600 text-center mb-6">Stay updated with the latest news tailored to you!</p>
        <form 
          onSubmit={(e) => { 
            e.preventDefault(); 
            handleSearch(); 
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Preferred Location</label>
            <input
              type="text"
              id="location"
              placeholder="Enter your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Preferred Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a category</option>
              <option value="technology">Technology</option>
              <option value="business">Business</option>
              <option value="sports">Sports</option>
              <option value="entertainment">Entertainment</option>
              <option value="health">Health</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Search News
          </button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;