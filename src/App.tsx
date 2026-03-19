import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import NewsPage from './pages/NewsPage';
import TrendingPage from './pages/TrendingPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans selection:bg-blue-200 selection:text-blue-900">
        <Header />
        
        <main className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/trending" element={<TrendingPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
