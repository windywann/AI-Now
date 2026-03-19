import { Link } from 'react-router-dom';
import { aiNews } from '../data/newsData';
import { Clock, ArrowRight, Zap } from 'lucide-react';

export default function NewsFeed({ limit, showHeader = true }: { limit?: number, showHeader?: boolean }) {
  const displayNews = limit ? aiNews.slice(0, limit) : aiNews;
  
  let lastDate = '';

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
              <Zap className="text-amber-500" size={24} />
              每日快讯
            </h2>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              实时更新
            </span>
          </div>
          {limit && (
            <Link to="/news" className="text-sm text-blue-600 hover:underline">查看全部</Link>
          )}
        </div>
      )}

      <div className="relative border-l border-[#d2d2d7] ml-3 pb-4">
        {displayNews.map((news) => {
          const showDate = news.date !== lastDate;
          lastDate = news.date;

          // Format date nicely (dynamic, based on today's date)
          const todayStr = new Date().toISOString().slice(0, 10);
          const yesterdayDate = new Date();
          yesterdayDate.setDate(yesterdayDate.getDate() - 1);
          const yesterdayStr = yesterdayDate.toISOString().slice(0, 10);
          const [, month, day] = news.date.split('-');
          let dateLabel: string;
          if (news.date === todayStr) dateLabel = `今天 (${parseInt(month)}月${parseInt(day)}日)`;
          else if (news.date === yesterdayStr) dateLabel = `昨天 (${parseInt(month)}月${parseInt(day)}日)`;
          else dateLabel = `${parseInt(month)}月${parseInt(day)}日`;

          return (
            <div key={news.id}>
              {showDate && (
                <div className="relative pl-8 py-4 mt-2">
                  <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-blue-600 border-[3px] border-[#f5f5f7] box-content"></div>
                  <span className="text-lg font-bold text-[#1d1d1f]">
                    {dateLabel}
                  </span>
                </div>
              )}
              
              <div className="relative pl-8 pb-8">
                <div className="absolute -left-[5px] top-8 w-2.5 h-2.5 rounded-full bg-[#d2d2d7] border-[3px] border-[#f5f5f7] box-content"></div>
                <a
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apple-card p-6 group cursor-pointer block no-underline"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-medium text-[#86868b] flex items-center gap-1">
                      <Clock size={14} />
                      {news.time}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 bg-[#f5f5f7] text-[#1d1d1f] rounded-md">
                      {news.category}
                    </span>
                    <span className="text-xs text-[#86868b] ml-auto">
                      {news.source}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors text-[#1d1d1f]">
                    {news.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-[#515154] mb-4">
                    {news.summary}
                  </p>
                  
                  <div className="flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                    阅读全文 <ArrowRight size={16} className="ml-1" />
                  </div>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
