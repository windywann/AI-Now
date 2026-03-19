import { Link } from 'react-router-dom';
import { githubTrending } from '../data/newsData';
import { Star, GitFork, TrendingUp, Github } from 'lucide-react';

export default function GithubTrending() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Github size={24} />
          GitHub Trending
        </h2>
        <Link to="/trending" className="text-sm text-blue-600 hover:underline">查看全部</Link>
      </div>

      <div className="space-y-4">
        {githubTrending.map((repo) => (
          <a
            key={repo.id}
            href={repo.url || `https://github.com/${repo.repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="apple-card p-5 flex flex-col gap-3 hover:border-blue-200 border border-transparent"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-base font-semibold text-blue-600 break-all">
                {repo.repo}
              </h3>
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full whitespace-nowrap">
                <TrendingUp size={12} />
                {repo.todayStars}
              </div>
            </div>

            <p className="text-sm text-[#515154] line-clamp-2">
              {repo.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-[#86868b] mt-1">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                {repo.language}
              </span>
              <span className="flex items-center gap-1">
                <Star size={14} />
                {repo.stars}
              </span>
              <span className="flex items-center gap-1">
                <GitFork size={14} />
                {repo.forks}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
