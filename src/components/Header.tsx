import { Sparkles, Menu } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';

export default function Header() {
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

          <button className="md:hidden text-[#86868b] hover:text-black transition-colors">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
