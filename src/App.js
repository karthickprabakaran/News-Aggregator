import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import UserLanding from './components/userLanding';
import Header from './components/Header';
import NewsPage from './components/newsPage';

function App() {
  return (
    <Router>
      <Header />
        <Routes>
          <Route path="/" element={<UserLanding />} />
          <Route path="/get-news" element={<NewsPage />} />
        </Routes>
    </Router>
  );
}

export default App;
