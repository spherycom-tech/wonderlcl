import * as React from 'react';
import { TrendDataPoint } from '../types';

interface Props {
  data: TrendDataPoint[];
  title?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
}

const TrendChart: React.FC<Props> = ({ data, title, primaryLabel = "Balance", secondaryLabel = "Interest" }) => {
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  if (!data || data.length < 2) return null;

  // Determine dimensions and scales
  const padding = 0;
  const width = 100;
  const height = 50;
  
  const maxVal = Math.max(...data.map(d => Math.max(d.primary, d.secondary || 0)));
  const minVal = 0;
  const range = maxVal - minVal || 1;

  // Helper to map data to SVG coordinates
  const getX = (index: number) => (index / (data.length - 1)) * width;
  const getY = (value: number) => height - ((value - minVal) / range) * height;

  // Formatting
  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val.toFixed(0)}`;
  };

  // Interaction Handlers
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    let clientX;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }

    const x = clientX - rect.left;
    const relativeX = Math.max(0, Math.min(1, x / rect.width));
    
    const index = Math.round(relativeX * (data.length - 1));
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  // Path Generation
  const createPath = (accessor: (d: TrendDataPoint) => number) => {
    return data.map((d, i) => 
      `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(2)} ${getY(accessor(d)).toFixed(2)}`
    ).join(' ');
  };

  const createAreaPath = (accessor: (d: TrendDataPoint) => number) => {
    const linePath = createPath(accessor);
    return `${linePath} L ${width} ${height} L 0 ${height} Z`;
  };

  const primaryD = createPath(d => d.primary);
  const primaryAreaD = createAreaPath(d => d.primary);
  const secondaryD = data[0].secondary !== undefined ? createPath(d => d.secondary || 0) : null;
  const secondaryAreaD = data[0].secondary !== undefined ? createAreaPath(d => d.secondary || 0) : null;

  // Active Data Point
  const activeIdx = hoverIndex !== null ? hoverIndex : data.length - 1;
  const activeData = data[activeIdx];

  return (
    <div className="w-full h-full animate-fade-in-up select-none flex flex-col">
       <div className="flex items-center justify-between mb-4 shrink-0">
          {title && <div className="text-xs font-black uppercase tracking-widest text-black/60">{title}</div>}
          
          {/* Legend */}
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                <span className="text-[10px] font-bold text-black/70 uppercase">{primaryLabel}</span>
             </div>
             {secondaryD && (
                <div className="flex items-center gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full bg-gray-400 border border-black/10"></div>
                   <span className="text-[10px] font-bold text-black/70 uppercase">{secondaryLabel}</span>
                </div>
             )}
          </div>
       </div>

      {/* Chart Area - fills remaining height */}
      <div className="relative w-full flex-1 overflow-hidden rounded-xl">
        <svg 
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`} 
            className="w-full h-full block touch-none cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseLeave}
            preserveAspectRatio="none"
        >
            <defs>
                <linearGradient id="primaryFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#000000" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.0"/>
                </linearGradient>
                <linearGradient id="secondaryFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1"/>
                </linearGradient>
            </defs>

            {/* Grid Lines (Horizontal) */}
            {[0, 0.25, 0.5, 0.75, 1].map(p => {
                const y = height - (p * height);
                return <line key={p} x1="0" y1={y} x2={width} y2={y} stroke="rgba(0,0,0,0.1)" strokeWidth="0.2" />;
            })}

            {/* Secondary Area & Line */}
            {secondaryAreaD && <path d={secondaryAreaD} fill="url(#secondaryFill)" />}
            {secondaryD && <path d={secondaryD} fill="none" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="1 1" />}

            {/* Primary Area & Line */}
            <path d={primaryAreaD} fill="url(#primaryFill)" />
            <path d={primaryD} fill="none" stroke="#000000" strokeWidth="1" />

            {/* Interactive Elements */}
            {hoverIndex !== null && activeData && (
                <g>
                    {/* Vertical Line */}
                    <line 
                        x1={getX(activeIdx)} 
                        y1={0} 
                        x2={getX(activeIdx)} 
                        y2={height} 
                        stroke="#000" 
                        strokeWidth="0.2" 
                        strokeDasharray="1 1"
                    />

                    {/* Points */}
                    <circle cx={getX(activeIdx)} cy={getY(activeData.primary)} r="1.2" fill="#000000" stroke="white" strokeWidth="0.5" />
                    {activeData.secondary !== undefined && (
                        <circle cx={getX(activeIdx)} cy={getY(activeData.secondary)} r="1.2" fill="#ffffff" stroke="black" strokeWidth="0.5" />
                    )}

                    {/* Tooltip Box */}
                    <g transform={`translate(${getX(activeIdx) > 50 ? getX(activeIdx) - 35 : getX(activeIdx) + 2}, 2)`}>
                        <rect width="33" height="20" rx="2" fill="#000000" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.2))" />
                        
                        {/* Label */}
                        <text x="3" y="6" fontSize="3" fill="#a3a3a3" fontWeight="bold" fontFamily="sans-serif">
                            {activeData.label}
                        </text>

                        {/* Primary Value */}
                        <rect x="3" y="9" width="1.5" height="1.5" rx="0.5" fill="#ffffff" />
                        <text x="6" y="10.5" fontSize="3" fill="#ffffff" fontFamily="sans-serif" fontWeight="500">
                             {primaryLabel}: {formatCurrency(activeData.primary)}
                        </text>

                        {/* Secondary Value */}
                        {activeData.secondary !== undefined && (
                            <>
                                <rect x="3" y="14" width="1.5" height="1.5" rx="0.5" fill="#a3a3a3" />
                                <text x="6" y="15.5" fontSize="3" fill="#d4d4d4" fontFamily="sans-serif" fontWeight="500">
                                    {secondaryLabel}: {formatCurrency(activeData.secondary)}
                                </text>
                            </>
                        )}
                    </g>
                </g>
            )}
        </svg>
      </div>
      <div className="flex justify-between px-1 mt-2 text-[10px] font-bold text-black/40 font-mono shrink-0">
          <span>{data[0].label}</span>
          <span>{data[Math.floor(data.length / 2)].label}</span>
          <span>{data[data.length - 1].label}</span>
      </div>
    </div>
  );
};

export default TrendChart;