import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Menu, X, Search, Calculator, ChevronRight } from 'lucide-react';
import { CATEGORIES, CALCULATORS } from '../constants';

const { Link, useLocation, useNavigate } = ReactRouterDOM;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const match = CALCULATORS.find(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (match) {
      navigate(`/calculator/${match.id}`);
      setSearchQuery('');
      setIsSidebarOpen(false);
    }
  };

  const handleBrowseTools = () => {
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation then scroll
      setTimeout(() => {
        const el = document.getElementById('categories');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('categories');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0C0C0E] text-white font-['Plus_Jakarta_Sans'] selection:bg-lime-400 selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-40 h-24 flex items-center w-full bg-[#0C0C0E]/80 backdrop-blur-xl border-b border-white/5">
        <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="lg:hidden p-3 bg-[#1C1C1E] rounded-full hover:bg-white/10 transition-colors">
              <Menu className="w-6 h-6 text-white" />
            </button>
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-lime-400 p-2.5 rounded-2xl shadow-[0_0_20px_rgba(163,230,53,0.5)] group-hover:rotate-12 transition-transform duration-300">
                <Calculator className="w-6 h-6 text-black" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-extrabold tracking-tight hidden sm:block">
                Wonder<span className="text-lime-400">Calc</span>
              </span>
            </Link>
          </div>

          {/* Search Bar - Hidden on home */}
          {location.pathname !== '/' && (
            <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-xl mx-12 animate-fade-in-up">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-lime-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search for a calculator..."
                  className="w-full pl-14 pr-6 py-4 bg-[#131315] border border-white/5 rounded-full text-sm font-medium text-white transition-all outline-none placeholder-gray-600 focus:ring-2 focus:ring-lime-400/20 focus:border-lime-400/50 shadow-inner"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          )}
          
           <div className="flex items-center gap-4">
              <button 
                onClick={handleBrowseTools}
                className="px-6 py-3 bg-white text-black hover:bg-lime-400 text-sm font-bold rounded-full transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:shadow-[0_0_20px_rgba(163,230,53,0.4)] transform hover:scale-105"
              >
                Browse Tools
              </button>
           </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-[1600px] mx-auto w-full pt-6">
        {/* Sidebar */}
        <aside 
          className={`
            fixed inset-y-0 left-0 z-30 w-80 bg-[#0C0C0E]/95 backdrop-blur-2xl border-r border-white/5 transform transition-transform duration-500 cubic-bezier(0.2, 0.8, 0.2, 1)
            lg:translate-x-0 lg:static lg:h-[calc(100vh-7rem)] lg:bg-transparent lg:border-none lg:overflow-y-auto scrollbar-hide
            ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
            p-6 pt-24 lg:pt-4
          `}
        >
           <div className="flex lg:hidden justify-end mb-8">
              <button onClick={toggleSidebar} className="p-2 bg-[#1C1C1E] rounded-full text-white">
                <X className="w-6 h-6" />
              </button>
           </div>

           <nav className="space-y-8">
             <div>
                <div className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-4 px-4">Menu</div>
                <div className="space-y-2">
                   <Link 
                    to="/"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center justify-between px-5 py-4 rounded-3xl text-sm font-bold transition-all duration-300 ${location.pathname === '/' ? 'bg-white text-black shadow-lg scale-[1.02]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                   >
                     <span>Overview</span>
                     {location.pathname === '/' && <div className="w-2 h-2 rounded-full bg-lime-400"></div>}
                   </Link>
                </div>
             </div>

             <div>
                <div className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-4 px-4">Categories</div>
                <div className="space-y-2">
                   {CATEGORIES.map((cat) => (
                     <Link 
                      key={cat.id} 
                      to={`/category/${cat.id}`}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`
                        group flex items-center justify-between px-5 py-4 rounded-3xl text-sm font-bold transition-all duration-300
                        ${location.pathname.includes(cat.id) 
                          ? 'bg-[#1C1C1E] text-white border border-white/10 shadow-lg scale-[1.02]' 
                          : 'text-gray-400 hover:bg-[#131315] hover:text-white'}
                      `}
                     >
                       <div className="flex items-center gap-3">
                           <div className={`w-2.5 h-2.5 rounded-full ${cat.color.replace('text-', 'bg-')} shadow-[0_0_8px_currentColor] transition-opacity duration-300 ${location.pathname.includes(cat.id) ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}></div>
                           {cat.name}
                       </div>
                       {location.pathname.includes(cat.id) && <ChevronRight className="w-4 h-4 text-white" />}
                     </Link>
                   ))}
                </div>
             </div>
           </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 lg:px-10 py-6 w-full overflow-x-hidden">
           {children}
        </main>
      </div>
      
      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Layout;