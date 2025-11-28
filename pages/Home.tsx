import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { CATEGORIES, CALCULATORS } from '../constants';
import CalculatorCard from '../components/CalculatorCard';
import { Search, ArrowRight, TrendingUp, Activity, Zap, MoveUpRight, Sparkles, Leaf, Trophy } from 'lucide-react';

const { Link, useNavigate } = ReactRouterDOM;

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigate = useNavigate();
  const popularCalculators = CALCULATORS.filter(c => c.popular).slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const match = CALCULATORS.find(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (match) {
      navigate(`/calculator/${match.id}`);
    }
  };

  return (
    <div className="space-y-12 pb-12">
      
      {/* Brutalist Hero Container */}
      <section className="px-2 pt-2 md:px-4 md:pt-4">
        <div className="relative bg-[#0E0E10] rounded-[2.5rem] md:rounded-[4rem] border border-white/5 overflow-hidden min-h-[750px] flex flex-col items-center justify-center text-center p-6 md:p-10 shadow-2xl">
            
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lime-400/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center w-full max-w-7xl">
                
                {/* Brutalist Typography - Split Lines */}
                <div className="flex flex-col items-center justify-center mb-8">
                   {/* Row 1: WONDER */}
                   <div className="overflow-hidden">
                      <h1 className="text-[14vw] md:text-[10rem] font-black text-white animate-mask-up leading-[0.8] tracking-tighter select-none">
                        WONDER
                      </h1>
                   </div>
                   
                   {/* Row 2: Block + CALC */}
                   <div className="flex items-center justify-center gap-3 md:gap-8 w-full mt-2 md:mt-4">
                       <div className="h-[10vw] md:h-28 aspect-[2.5/1] bg-lime-400 rounded-full md:rounded-3xl animate-mask-up delay-100 flex items-center justify-center relative overflow-hidden shadow-[0_0_40px_rgba(163,230,53,0.3)]">
                          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.05)_10px,rgba(0,0,0,0.05)_20px)]"></div>
                          <MoveUpRight className="w-6 h-6 md:w-12 md:h-12 text-black animate-pulse" strokeWidth={3.5} />
                       </div>
                       <div className="overflow-hidden">
                          <h1 className="text-[14vw] md:text-[10rem] font-black text-white animate-mask-up delay-200 leading-[0.8] tracking-tighter select-none">
                            CALC
                          </h1>
                       </div>
                   </div>
                </div>

                {/* Description */}
                <div className="overflow-hidden mb-12 max-w-2xl mx-auto">
                    <p className="text-lg md:text-2xl text-gray-400 font-medium animate-mask-up delay-300 leading-relaxed">
                       Universal computation engine. <br className="hidden md:block" />
                       Powered by <span className="text-lime-400 font-bold">Gemini 2.5</span>.
                    </p>
                </div>

                {/* Integrated Search Bar */}
                <div className="w-full max-w-xl animate-fade-in-up delay-500 z-20 relative">
                     <form onSubmit={handleSearch} className="relative group">
                        <div className="relative flex items-center bg-[#161618] rounded-full p-2 border-2 border-white/10 shadow-xl transition-colors duration-300 focus-within:border-lime-400 group-hover:border-white/20">
                            <div className="pl-6">
                                <Search className="w-6 h-6 text-gray-500 group-focus-within:text-lime-400 transition-colors" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Calculate anything..." 
                                className="flex-1 px-4 py-4 bg-transparent outline-none text-white placeholder-gray-600 text-lg font-bold font-['Plus_Jakarta_Sans']"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="p-4 bg-white text-black rounded-full hover:bg-lime-400 transition-all duration-300 hover:scale-105 hover:rotate-12">
                                <ArrowRight className="w-6 h-6" strokeWidth={3} />
                            </button>
                        </div>
                    </form>

                    {/* Trending Chips */}
                    <div className="flex flex-wrap justify-center gap-3 mt-8">
                        <span className="text-xs font-black text-gray-600 uppercase tracking-widest py-2 mr-2">Trending</span>
                        {['Auto Loan', 'BMI', 'Mortgage'].map((item, i) => (
                            <Link 
                                key={item}
                                to={`/calculator/${item.toLowerCase().replace(' ', '-')}`}
                                className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-bold text-gray-400 hover:bg-white hover:text-black hover:border-white transition-all duration-300 uppercase tracking-wide cursor-pointer active:scale-95"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Bento Grid Categories */}
      <section id="categories" className="animate-fade-in-up delay-500 max-w-[1400px] mx-auto px-4">
        <div className="flex items-end justify-between mb-8 px-2">
            <h2 className="text-4xl font-black text-white tracking-tight">Categories</h2>
        </div>
        
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[240px]">
            
            {/* 1. Feature Card - Financial (Lime) */}
            <Link to="/category/financial" className="md:col-span-2 md:row-span-2 bg-lime-400 rounded-[2.5rem] p-10 relative overflow-hidden group hover:scale-[0.99] transition-all duration-500 flex flex-col justify-between shadow-lg cursor-pointer">
                <div className="relative z-10">
                    <div className="p-3 bg-black/10 rounded-2xl w-fit mb-6 backdrop-blur-sm border border-black/5">
                        <TrendingUp className="w-8 h-8 text-black" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-5xl md:text-7xl font-black text-black mb-4 tracking-tighter">Finance</h3>
                    <p className="text-black/70 text-xl font-bold max-w-xs leading-tight">Loans, Mortgages & Investments.</p>
                </div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                        <ArrowRight className="w-5 h-5" />
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -bottom-20 -right-20 w-96 h-96 border-[60px] border-black/5 rounded-full group-hover:scale-110 transition-transform duration-700 ease-in-out"></div>
            </Link>

            {/* 2. Tall Card - Health (Dark + Rose Glow) */}
            <Link to="/category/health" className="md:col-span-1 md:row-span-2 bg-[#161618] rounded-[2.5rem] p-8 border border-white/5 hover:border-rose-400/50 transition-all duration-300 flex flex-col relative group overflow-hidden hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center space-y-6">
                     <div className="w-24 h-24 bg-[#0C0C0E] rounded-full flex items-center justify-center text-rose-400 group-hover:bg-rose-400 group-hover:text-black transition-all duration-300 shadow-xl group-hover:scale-110">
                        <Activity className="w-10 h-10" />
                     </div>
                     <div>
                        <h3 className="text-3xl font-black text-white mb-2">Health</h3>
                        <p className="text-gray-500 font-medium text-sm">Body & Fitness</p>
                     </div>
                </div>
                
                <div className="relative z-10 mt-auto w-full">
                    <div className="w-full h-14 rounded-full bg-[#0C0C0E] border border-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-300">
                         <ArrowRight className="w-5 h-5" />
                    </div>
                </div>
            </Link>

            {/* 3. Standard Card - Math (Cyan) */}
            <Link to="/category/math" className="md:col-span-1 bg-[#161618] rounded-[2.5rem] p-8 hover:bg-cyan-400 transition-all duration-300 flex flex-col justify-between group border border-white/5 relative overflow-hidden cursor-pointer">
                <div className="flex justify-between items-start relative z-10">
                    <h3 className="text-3xl font-black text-white group-hover:text-black transition-colors">Math</h3>
                </div>
                <div className="relative z-10 flex items-end justify-between">
                    <p className="text-sm text-gray-400 group-hover:text-black/70 font-bold">Algebra & Stats</p>
                     <div className="p-2 bg-white/5 rounded-full group-hover:bg-black/20 text-cyan-400 group-hover:text-black transition-colors">
                        <Zap className="w-6 h-6" />
                    </div>
                </div>
            </Link>

             {/* 4. Standard Card - Physics (Violet) */}
            <Link to="/category/physics" className="md:col-span-1 bg-[#161618] rounded-[2.5rem] p-8 hover:bg-violet-400 transition-all duration-300 flex flex-col justify-between group border border-white/5 relative overflow-hidden cursor-pointer">
                 <div className="flex justify-between items-start relative z-10">
                    <h3 className="text-3xl font-black text-white group-hover:text-black transition-colors">Physics</h3>
                </div>
                <div className="relative z-10 flex items-end justify-between">
                    <p className="text-sm text-gray-400 group-hover:text-black/70 font-bold">Force & Motion</p>
                    <div className="p-2 bg-white/5 rounded-full group-hover:bg-black/20 text-violet-400 group-hover:text-black transition-colors">
                        <Zap className="w-6 h-6" />
                    </div>
                </div>
            </Link>

             {/* 5. Wide Card - Construction (Orange) */}
            <Link to="/category/construction" className="md:col-span-2 bg-orange-400 rounded-[2.5rem] p-8 text-black hover:bg-orange-300 transition-colors flex items-center justify-between group relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-black/10 rounded-full text-[10px] font-black uppercase tracking-wider">Heavy Duty</span>
                    </div>
                    <h3 className="text-4xl font-black mb-2 tracking-tight">Construction</h3>
                    <p className="text-black/70 font-bold">Materials, Paint & Flooring.</p>
                </div>
                <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                    <MoveUpRight className="w-8 h-8" />
                </div>
                <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/20 rounded-full blur-2xl"></div>
            </Link>
            
            {/* 6. Card - Everyday (Indigo) */}
            <Link to="/category/everyday" className="md:col-span-1 bg-[#161618] border border-white/5 rounded-[2.5rem] p-6 flex flex-col justify-center items-center hover:border-indigo-400/50 transition-all group hover:bg-[#202022]">
                <div className="w-12 h-12 bg-[#0C0C0E] rounded-2xl flex items-center justify-center text-indigo-400 mb-4 group-hover:bg-indigo-400 group-hover:text-white transition-colors shadow-lg group-hover:scale-110">
                    <Sparkles className="w-6 h-6" />
                </div>
                <span className="font-bold text-white text-lg">Everyday</span>
            </Link>
            
            {/* 7. Card - Conversions (Pink) */}
            <Link to="/category/conversions" className="md:col-span-1 bg-[#161618] border border-white/5 rounded-[2.5rem] p-6 flex flex-col justify-center items-center hover:border-pink-400/50 transition-all group hover:bg-[#202022]">
                 <div className="w-12 h-12 bg-[#0C0C0E] rounded-2xl flex items-center justify-center text-pink-400 mb-4 group-hover:bg-pink-400 group-hover:text-white transition-colors shadow-lg group-hover:scale-110">
                    <MoveUpRight className="w-6 h-6" />
                </div>
                 <span className="font-bold text-white text-lg">Convert</span>
            </Link>

            {/* 8. Card - Sports (Yellow) */}
            <Link to="/category/sports" className="md:col-span-1 bg-[#161618] border border-white/5 rounded-[2.5rem] p-6 flex flex-col justify-center items-center hover:border-yellow-400/50 transition-all group hover:bg-[#202022]">
                 <div className="w-12 h-12 bg-[#0C0C0E] rounded-2xl flex items-center justify-center text-yellow-400 mb-4 group-hover:bg-yellow-400 group-hover:text-black transition-colors shadow-lg group-hover:scale-110">
                    <Trophy className="w-6 h-6" />
                </div>
                 <span className="font-bold text-white text-lg">Sports</span>
            </Link>

             {/* 9. Card - Ecology (Emerald) */}
             <Link to="/category/ecology" className="md:col-span-1 bg-[#161618] border border-white/5 rounded-[2.5rem] p-6 flex flex-col justify-center items-center hover:border-emerald-400/50 transition-all group hover:bg-[#202022]">
                 <div className="w-12 h-12 bg-[#0C0C0E] rounded-2xl flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-400 group-hover:text-white transition-colors shadow-lg group-hover:scale-110">
                    <Leaf className="w-6 h-6" />
                </div>
                 <span className="font-bold text-white text-lg">Ecology</span>
            </Link>
        </div>
      </section>

      {/* Trending Tools Section */}
      <section className="animate-fade-in-up delay-700 max-w-[1400px] mx-auto px-4">
        <div className="flex items-center gap-4 mb-8 px-2">
            <div className="p-2 bg-[#1C1C1E] text-lime-400 rounded-xl border border-white/5">
                <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Popular Tools</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularCalculators.map(calc => {
                const cat = CATEGORIES.find(c => c.id === calc.categoryId);
                return <CalculatorCard key={calc.id} calculator={calc} category={cat} featured />;
            })}
        </div>
      </section>
    </div>
  );
};

export default Home;