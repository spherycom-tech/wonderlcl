import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { CalculatorDef, Category } from '../types';
import { ArrowUpRight, Calculator, Zap } from 'lucide-react';

const { Link } = ReactRouterDOM;

interface Props {
  calculator: CalculatorDef;
  category?: Category;
  featured?: boolean;
}

const CalculatorCard: React.FC<Props> = ({ calculator, category, featured }) => {
  return (
    <Link 
      to={`/calculator/${calculator.id}`}
      className={`
        group relative p-7 rounded-[2.5rem] transition-all duration-500 flex flex-col h-full
        ${featured 
          ? 'bg-[#1C1C1E] border border-white/10 hover:border-lime-400/50 shadow-2xl hover:shadow-[0_0_30px_-5px_rgba(163,230,53,0.15)]' 
          : 'bg-[#131315] border border-white/5 hover:border-white/10 hover:bg-[#1A1A1C]'}
        hover:-translate-y-2
      `}
    >
      <div className="flex items-start justify-between mb-8">
        <div className={`
            p-4 rounded-2xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110
            ${category ? category.color.replace('text-', 'bg-') + '/10 ' + category.color : 'bg-gray-800 text-gray-400'}
        `}>
           {/* Icon placeholder logic */}
           <Zap className="w-6 h-6" />
        </div>
        
        <div className={`
            w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border
            ${featured 
                ? 'bg-lime-400 text-black border-lime-400 group-hover:bg-lime-300' 
                : 'bg-transparent border-white/10 text-gray-500 group-hover:border-white/30 group-hover:text-white'}
        `}>
            <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>
      
      <div className="mt-auto">
          <h3 className={`text-2xl font-bold text-white mb-3 leading-tight group-hover:text-lime-400 transition-colors duration-300`}>
            {calculator.name}
          </h3>
          
          <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-2 group-hover:text-gray-400 transition-colors">
            {calculator.description}
          </p>
          
          {category && (
            <div className="mt-6 flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${category.color.replace('text-', 'bg-')}`}></div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600 group-hover:text-gray-400 transition-colors">
                    {category.name}
                </span>
            </div>
          )}
      </div>
      
      {/* Featured Gradient Glow */}
      {featured && (
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-lime-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      )}
    </Link>
  );
};

export default CalculatorCard;