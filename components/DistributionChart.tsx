import * as React from 'react';
import { TrendDataPoint } from '../types';

interface Props {
  data: TrendDataPoint[];
  title?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
}

const DistributionChart: React.FC<Props> = ({ data, title, primaryLabel = "Value", secondaryLabel }) => {
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  
  if (!data || data.length === 0) return null;

  // Formatting
  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val.toFixed(0)}`;
  };

  // Find max value for scaling (Stacked total)
  const maxVal = Math.max(...data.map(d => d.primary + (d.secondary || 0)));
  
  const activeData = hoverIndex !== null ? data[hoverIndex] : null;

  return (
    <div className="w-full flex flex-col h-full select-none animate-fade-in-up">
      {/* Header / Current Value */}
      <div className="flex items-end justify-between mb-6">
         <div>
             {title && <div className="text-xs font-black uppercase tracking-widest text-black/60 mb-1">{title}</div>}
             <div className="text-4xl font-black text-black tracking-tighter">
                {activeData 
                    ? formatCurrency(activeData.primary + (activeData.secondary || 0)) 
                    : formatCurrency(data[data.length-1].primary + (data[data.length-1].secondary || 0))}
             </div>
             <div className="text-sm font-bold text-black/50">
                {activeData ? activeData.label : 'Projected Total'}
             </div>
         </div>
         
         {/* Legend - Always Visible */}
         <div className="flex flex-col items-end md:flex-row md:items-center gap-2 md:gap-3">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-black rounded-sm shadow-sm"></div>
                <span className="text-xs font-bold text-black/70 uppercase">{primaryLabel}</span>
            </div>
            {secondaryLabel && (
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white border border-black/10 rounded-sm shadow-sm"></div>
                    <span className="text-xs font-bold text-black/70 uppercase">{secondaryLabel}</span>
                </div>
            )}
         </div>
      </div>

      {/* Graph Container */}
      <div className="flex-1 relative flex items-end gap-[3px] md:gap-2 border-l border-b border-black/10 pl-2 pb-2 min-h-[180px]">
        
        {/* Horizontal Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
            {[1, 0.75, 0.5, 0.25, 0].map((line, i) => (
                <div key={i} className="w-full border-t border-dashed border-black/30 h-0 flex items-center">
                    {/* Y-Axis Label */}
                    <span className="text-[9px] font-bold text-black transform -translate-y-2 -translate-x-8 w-6 text-right">
                        {i === 4 ? '0' : formatCurrency(maxVal * line).replace('$', '')}
                    </span>
                </div>
            ))}
        </div>

        {/* Bars */}
        {data.map((point, i) => {
            const total = point.primary + (point.secondary || 0);
            const primaryHeight = (point.primary / total) * 100; // % of the stack
            const secondaryHeight = point.secondary ? (point.secondary / total) * 100 : 0; // % of the stack
            
            const totalHeightPercent = (total / maxVal) * 100; // Height relative to graph

            const isHovered = hoverIndex === i;

            return (
                <div 
                    key={i}
                    className="relative flex-1 flex flex-col justify-end group h-full z-10"
                    onMouseEnter={() => setHoverIndex(i)}
                    onMouseLeave={() => setHoverIndex(null)}
                    onTouchStart={() => setHoverIndex(i)}
                >
                    {/* Hit Area */}
                    <div className="absolute inset-0 cursor-crosshair"></div>

                    {/* Stacked Bar Container */}
                    <div 
                        style={{ height: `${totalHeightPercent}%` }}
                        className={`w-full min-w-[4px] rounded-t-sm transition-all duration-300 flex flex-col justify-end overflow-hidden ${isHovered ? 'shadow-lg scale-x-110 z-20' : ''}`}
                    >
                         {/* Secondary (Top) */}
                         {point.secondary && point.secondary > 0 && (
                            <div 
                                style={{ height: `${secondaryHeight}%` }}
                                className={`w-full bg-white border-b border-black/5 ${isHovered ? 'opacity-100' : 'opacity-80'}`}
                            ></div>
                         )}

                         {/* Primary (Bottom) */}
                         <div 
                            style={{ height: `${primaryHeight}%` }}
                            className="w-full bg-black"
                         ></div>
                    </div>
                </div>
            );
        })}

        {/* Active Tooltip Line (Optional, simplified to Bar Highlight above) */}
      </div>
      
      {/* X-Axis Labels */}
      <div className="flex justify-between mt-3 pl-8 text-[10px] font-bold text-black/50 font-mono">
          <span>{data[0].label}</span>
          <span>{data[Math.floor(data.length / 2)].label}</span>
          <span>{data[data.length - 1].label}</span>
      </div>
    </div>
  );
};

export default DistributionChart;