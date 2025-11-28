import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { CATEGORIES, CALCULATORS } from '../constants';
import CalculatorCard from '../components/CalculatorCard';
import { ArrowLeft } from 'lucide-react';

const { useParams, useNavigate, Navigate } = ReactRouterDOM;

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const category = CATEGORIES.find(c => c.id === categoryId);

  if (!category) {
    return <Navigate to="/" />;
  }

  const categoryCalculators = CALCULATORS.filter(c => c.categoryId === category.id);

  return (
    <div className="space-y-12">
      <div>
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all mb-8 font-bold text-sm group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
          </button>

          <div className="bg-[#1C1C1E] rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden">
            <div className="relative z-10">
                <h1 className={`text-5xl font-extrabold mb-4 tracking-tight ${category.color}`}>{category.name}</h1>
                <p className="text-xl text-gray-400 max-w-2xl font-medium">{category.description}</p>
            </div>
            <div className={`absolute -right-10 -top-10 w-64 h-64 rounded-full opacity-10 blur-3xl ${category.color.replace('text-', 'bg-')}`}></div>
          </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryCalculators.map(calc => (
          <CalculatorCard key={calc.id} calculator={calc} category={category} />
        ))}
      </div>
      
      {categoryCalculators.length === 0 && (
        <div className="text-center py-20 rounded-3xl border border-white/5 bg-[#1C1C1E]">
          <p className="text-gray-500 font-medium">No calculators found in this category yet.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;