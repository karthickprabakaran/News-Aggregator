import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import UserLanding from './components/userLanding';
import NewsPage from './components/newsPage';

function App() {
  return (
    <Router>
      <Header />
          <Routes>
            <Route path="/" element={<UserLanding />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/profile" element={<Navigate to="/" />} />
            <Route path="/settings" element={<Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
    </Router>
  );
}

export default App;