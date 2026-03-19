import { useState, useEffect } from 'react';
import { Github, TrendingUp, Star, GitFork, ArrowUp } from 'lucide-react';
import { fetchTrendingData } from '../lib/content';
import type { TrendingItem } from '../types/content';

export default function TrendingPage() {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    const range = timeRange === 'today' ? 'daily' : timeRange === 'week' ? 'weekly' : 'monthly';

    fetchTrendingData(range)
      .then((data) => {
        if (!mounted) return;
        setItems(data.items);
        setError(null);
      })
      .catch(() => {
        if (!mounted) return;
        setError('Trending 加载失败');
      });

    return () => {
      mounted = false;
    };
  }, [timeRange]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-12">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-black text-white rounded-2xl mb-6">
          <Github size={32} />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">GitHub Trending</h1>
        <p className="text-lg text-[#86868b] max-w-2xl mx-auto">
          探索开源社区中最受关注的 AI 项目、大模型微调框架与前沿工具。
        </p>
      </div>

      <div className="max-w-4xl mx-auto mb-8 flex justify-center">
        <div className="bg-[#e5e5ea] p-1 rounded-xl inline-flex">
          <button
            onClick={() => setTimeRange('today')}
            className={`px-6 py-1.5 rounded-lg text-sm font-medium transition-all ${timeRange === 'today' ? 'bg-white shadow-sm text-black' : 'text-[#86868b] hover:text-black'}`}
          >今日</button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-6 py-1.5 rounded-lg text-sm font-medium transition-all ${timeRange === 'week' ? 'bg-white shadow-sm text-black' : 'text-[#86868b] hover:text-black'}`}
          >本周</button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-6 py-1.5 rounded-lg text-sm font-medium transition-all ${timeRange === 'month' ? 'bg-white shadow-sm text-black' : 'text-[#86868b] hover:text-black'}`}
          >本月</button>
        </div>
      </div>

      {error && <div className="max-w-4xl mx-auto mb-4 text-sm text-red-600">{error}</div>}

      <div className="max-w-4xl mx-auto space-y-6">
        {items.map((repo) => (
          <a
            key={repo.id}
            href={repo.url || `https://github.com/${repo.repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="apple-card p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 hover:border-blue-200 border border-transparent"
          >
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-semibold text-blue-600 break-all">{repo.repo}</h3>
              </div>
              <p className="text-[15px] text-[#515154] mb-4">{repo.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#86868b]">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
                  {repo.language}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star size={16} />
                  {repo.stars}
                </span>
                <span className="flex items-center gap-1.5">
                  <GitFork size={16} />
                  {repo.forks}
                </span>
              </div>
            </div>

            <div className="md:text-right flex items-center md:flex-col gap-2 md:gap-1">
              <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full whitespace-nowrap">
                <TrendingUp size={14} />
                {repo.todayStars}
              </div>
            </div>
          </a>
        ))}
      </div>

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
