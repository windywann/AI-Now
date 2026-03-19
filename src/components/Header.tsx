import { useState, useRef, useEffect } from 'react';
import { Sparkles, Menu, Mail } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';

export default function Header() {
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const subscribeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (subscribeRef.current && !subscribeRef.current.contains(event.target as Node)) {
        setIsSubscribeOpen(false);
      }
    };

    if (isSubscribeOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSubscribeOpen]);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `text-[15px] transition-colors ${
      isActive ? 'text-black font-medium' : 'text-[#86868b] hover:text-black'
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-black text-white p-1.5 rounded-xl">
              <Sparkles size={20} />
            </div>
            <span className="font-semibold text-xl tracking-tight">AI Now</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <NavLink to="/" className={navClass}>首页</NavLink>
            <NavLink to="/news" className={navClass}>快讯</NavLink>
            <NavLink to="/trending" className={navClass}>Trending</NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative" ref={subscribeRef}>
              <button
                onClick={() => setIsSubscribeOpen(!isSubscribeOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] transition-colors cursor-pointer text-sm font-medium"
              >
                <Mail size={16} />
                <span className="hidden sm:inline">订阅</span>
              </button>

              {isSubscribeOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-[#d2d2d7] p-5 z-50">
                  <h3 className="text-base font-semibold mb-1">订阅每日简报</h3>
                  <p className="text-xs text-[#86868b] mb-4">每天早晨，将最重要的 AI 资讯直接送达您的邮箱。</p>

                  {/* 订阅功能暂时关闭 */}
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="订阅功能暂时关闭"
                      className="flex-1 px-3 py-2 rounded-lg border border-[#d2d2d7] text-sm bg-[#f5f5f7] text-[#86868b]"
                      disabled
                    />
                    <button
                      type="button"
                      disabled
                      className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium opacity-60 cursor-not-allowed"
                    >
                      暂不可用
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button className="md:hidden text-[#86868b] hover:text-black transition-colors">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
