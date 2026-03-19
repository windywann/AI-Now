import { useState, useEffect } from 'react';
import NewsFeed from '../components/NewsFeed';
import { Zap, ArrowUp } from 'lucide-react';

export default function NewsPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-12">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-amber-500 text-white rounded-2xl mb-6">
          <Zap size={32} />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">每日AI简报</h1>
        <p className="text-lg text-[#86868b] max-w-2xl mx-auto">
          回顾 AI 领域的每一个重要时刻。
        </p>
      </div>

      <div className="max-w-3xl min-[1200px]:max-w-[922px] mx-auto transition-all duration-300">
        <NewsFeed showHeader={false} />
      </div>

      {/* 回到顶部按钮 */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 z-50 flex items-center justify-center cursor-pointer ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
        aria-label="回到顶部"
      >
        <ArrowUp size={24} />
      </button>
    </div>
  );
}
