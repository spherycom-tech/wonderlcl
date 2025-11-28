import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { CALCULATORS, CATEGORIES } from '../constants';
import { calculateLocal } from '../services/geminiService';
import { CalculationResult } from '../types';
import { ChevronRight, RefreshCw, Info, ArrowLeft } from 'lucide-react';
import DistributionChart from '../components/DistributionChart';
import ResultChart from '../components/ResultChart';

const { useParams, useNavigate, Navigate } = ReactRouterDOM;

const CalculatorPage: React.FC = () => {
  const { calculatorId } = useParams<{ calculatorId: string }>();
  const navigate = useNavigate();
  const calculator = CALCULATORS.find(c => c.id === calculatorId);
  
  const [inputs, setInputs] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<CalculationResult | null>(null);

  // Initialize inputs
  React.useEffect(() => {
    if (!calculator) return;

    setResult(null);
    const initialInputs: Record<string, string> = {};
    if (calculator.inputs) {
      // Pre-fill default values
      calculator.inputs.forEach(input => {
        if (input.defaultValue) initialInputs[input.name] = input.defaultValue;
      });
    }
    setInputs(initialInputs);
  }, [calculator]);

  if (!calculator) {
    return <Navigate to="/" />;
  }

  const category = CATEGORIES.find(c => c.id === calculator.categoryId);
  
  // Extract color name (e.g., "lime-400" from "text-lime-400")
  const colorClass = category ? category.color.replace('text-', '') : 'lime-400';
  
  // Construct dynamic background class
  // Note: Tailwind needs full class names to be scannable, but since we use standard colors mapped in constants, 
  // we can use style attribute or predictable replacements if configured. 
  // For safety with arbitrary values, we'll use style for the specific color or assume the color names match standard tailwind palette.
  const bgClass = category ? category.color.replace('text-', 'bg-') : 'bg-lime-400';

  const handleInputChange = (name: string, value: string) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Use LOCAL calculation engine
    const res = await calculateLocal(calculator.id, inputs);
    setResult(res);
    setLoading(false);
    
    // Scroll to result on mobile/desktop after calculation
    setTimeout(() => {
        const resultEl = document.getElementById('calculation-result');
        if (resultEl) resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up pb-20 px-4 md:px-8">
      {/* Breadcrumbs & Header */}
      <div className="mb-10">
        <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all mb-8 font-bold text-sm group"
        >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
        </button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                 <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">{calculator.name}</h1>
                 <p className="text-xl text-gray-400 font-medium max-w-2xl">{calculator.description}</p>
            </div>
            {category && (
                <div className={`px-5 py-2 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center gap-2 self-start md:self-auto`}>
                    <div className={`w-2 h-2 rounded-full ${category.color.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor]`}></div>
                    <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">{category.name}</span>
                </div>
            )}
        </div>
      </div>

      {/* Layout: Always Column to keep results below inputs even on landscape */}
      <div className="flex flex-col gap-12">
        {/* Calculator Form Section */}
        <div className="w-full">
           <div className="bg-[#131315] rounded-[3rem] border border-white/5 overflow-hidden relative shadow-2xl">
              {/* Decorative gradient at top using Category Color */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${colorClass} to-transparent opacity-50`}></div>

              <div className="p-6 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
                    {calculator.inputs?.map((input) => (
                      <div key={input.name} className="col-span-1 group">
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-white transition-colors">
                          {input.label}
                        </label>
                        
                        {input.type === 'select' ? (
                            <div className="relative">
                                  <select
                                    className="block w-full rounded-2xl bg-[#1C1C1E] border border-white/10 text-white px-5 py-4 focus:border-white/50 focus:ring-2 focus:ring-white/10 outline-none transition-all font-bold appearance-none cursor-pointer"
                                    onChange={(e) => handleInputChange(input.name, e.target.value)}
                                    value={inputs[input.name] || ''}
                                  >
                                    {input.options?.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                  </select>
                                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gray-400">
                                    <ChevronRight className="w-4 h-4 rotate-90" />
                                  </div>
                            </div>
                        ) : (
                            <div className="relative">
                                {input.unit && input.unit === '$' && (
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                                        <span className="text-gray-500 font-bold">$</span>
                                    </div>
                                )}
                                <input
                                    type={input.type}
                                    required
                                    placeholder={input.placeholder}
                                    className={`
                                        block w-full rounded-2xl bg-[#1C1C1E] border border-white/10 text-white py-4 
                                        focus:border-white/50 focus:ring-2 focus:ring-white/10 outline-none transition-all font-bold placeholder-gray-700
                                        ${input.unit === '$' ? 'pl-10 pr-5' : 'pl-5 pr-12'}
                                    `}
                                    onChange={(e) => handleInputChange(input.name, e.target.value)}
                                    value={inputs[input.name] || ''}
                                />
                                {input.unit && input.unit !== '$' && (
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-5">
                                    <span className="text-gray-500 font-bold text-xs bg-[#2C2C2E] px-2 py-1 rounded-md">{input.unit}</span>
                                    </div>
                                )}
                            </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`
                        w-full md:w-auto md:min-w-[200px] flex justify-center items-center py-5 px-10 rounded-full text-lg font-black tracking-wide text-black 
                        ${loading ? 'bg-gray-700 cursor-not-allowed opacity-50' : `${bgClass} hover:opacity-90 hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)]`}
                        transition-all duration-300
                      `}
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                          Computing...
                        </>
                      ) : (
                        'Calculate'
                      )}
                    </button>
                  </div>
                </form>
              </div>
           </div>
        </div>

        {/* Result Area - DYNAMIC BACKGROUND COLOR */}
        <div id="calculation-result" className="w-full space-y-6">
           {result ? (
                <div className="animate-fade-in-up space-y-4">
                    {/* Main Result Card - Uses Category Color */}
                    <div className={`${bgClass} rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] relative transition-colors duration-500`}>
                        <div className="p-6 md:p-12 relative z-10 flex flex-col gap-8">
                            
                            {/* Header Section */}
                            <div className="text-center md:text-left">
                                <div className="text-xs font-black uppercase tracking-widest text-black/60 mb-2">Total Result</div>
                                <div className="text-5xl md:text-7xl font-black text-black mb-2 tracking-tighter leading-none break-words">
                                    {result.result}
                                </div>
                                <div className="text-xl md:text-2xl text-black/70 font-bold">{result.unit}</div>
                            </div>
                            
                            {/* Charts Section - Grid Layout */}
                            {(result.chartData || (result.trendData && result.trendData.length > 0)) && (
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                                  {/* Pie Chart (Composition) */}
                                  {result.chartData && result.chartData.length > 0 && (
                                    <div className="p-6 md:p-8 bg-white/20 rounded-[2rem] backdrop-blur-md border border-black/5 flex flex-col shadow-lg">
                                        <div className="text-xs font-black uppercase tracking-widest text-black/60 mb-4">Breakdown</div>
                                        <ResultChart data={result.chartData} />
                                    </div>
                                  )}

                                  {/* Histogram (Distribution) */}
                                  {result.trendData && result.trendData.length > 0 && (
                                    <div className={`p-6 md:p-8 bg-white/20 rounded-[2rem] backdrop-blur-md border border-black/5 flex flex-col shadow-lg ${!result.chartData ? 'col-span-full' : ''}`}>
                                        <DistributionChart 
                                          data={result.trendData} 
                                          title={calculator.id === 'compound-interest' ? 'Growth Over Time' : 'Annual Payment Breakdown'}
                                          primaryLabel={calculator.id === 'compound-interest' ? 'Principal' : 'Principal Paid'}
                                          secondaryLabel={calculator.id === 'compound-interest' ? 'Interest' : 'Interest Paid'}
                                        />
                                    </div>
                                  )}
                              </div>
                            )}

                            <div className="h-px w-full bg-black/10 my-2"></div>

                            <div className="space-y-6">
                                <p className="text-black font-bold text-lg md:text-2xl leading-snug">
                                    {result.details}
                                </p>
                                
                                <div className="bg-black/10 rounded-3xl p-6 md:p-8 backdrop-blur-md border border-black/5">
                                    <div className="flex items-center gap-2 mb-4 opacity-70">
                                        <Info className="w-5 h-5 text-black" />
                                        <span className="text-xs font-black uppercase text-black tracking-widest">Details</span>
                                    </div>
                                    <ul className="space-y-3">
                                        {result.steps?.map((step, i) => (
                                            <li key={i} className="text-sm md:text-base text-black font-bold flex items-start gap-3">
                                                <span className="w-2 h-2 rounded-full bg-black mt-2 shrink-0"></span>
                                                <span className="flex-1">{step}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        {/* Abstract Decorative Circles */}
                        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/30 rounded-full blur-3xl pointer-events-none mix-blend-overlay"></div>
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                    </div>
                    
                    <button 
                        onClick={() => setResult(null)}
                        className="w-full py-5 rounded-full border border-white/10 text-gray-400 font-bold hover:text-white hover:bg-white/5 transition-colors"
                    >
                        Clear Result
                    </button>
                </div>
           ) : (
             <div className="space-y-6">
                <div className={`rounded-[3rem] p-10 border border-white/5 bg-[#131315] relative overflow-hidden`}>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-[#1C1C1E] rounded-2xl flex items-center justify-center mb-6 text-white">
                            <Info className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-white text-2xl mb-3">How it works</h3>
                        <p className="text-gray-400 leading-relaxed font-medium">
                            {calculator.description}
                        </p>
                        <div className="mt-8 pt-8 border-t border-white/5">
                            <p className="text-sm text-gray-500 font-medium">
                                This tool runs instantly on your device using standard formulas. No data is sent to external servers.
                            </p>
                        </div>
                    </div>
                    {/* Subtle glow matching category */}
                    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-${colorClass}/10 to-transparent rounded-full blur-3xl -mr-20 -mt-20`}></div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;