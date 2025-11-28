import * as React from 'react';
import { ChartDataPoint } from '../types';

interface Props {
  data: ChartDataPoint[];
}

const ResultChart: React.FC<Props> = ({ data }) => {
  const validData = data.filter(d => d.value > 0);
  const total = validData.reduce((acc, cur) => acc + cur.value, 0);
  
  if (total === 0) return null;

  let currentAngle = 0;
  
  // Function to calculate SVG path for a slice
  const getPath = (value: number, index: number) => {
    const percentage = value / total;
    const angle = percentage * 360;
    
    // Convert polar to cartesian
    // SVG center is 50,50. Radius 40.
    const startAngleRad = (currentAngle - 90) * (Math.PI / 180);
    const endAngleRad = (currentAngle + angle - 90) * (Math.PI / 180);
    
    const x1 = 50 + 40 * Math.cos(startAngleRad);
    const y1 = 50 + 40 * Math.sin(startAngleRad);
    
    const x2 = 50 + 40 * Math.cos(endAngleRad);
    const y2 = 50 + 40 * Math.sin(endAngleRad);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    // Donut hole radius (inner) = 25
    const x1_in = 50 + 25 * Math.cos(startAngleRad);
    const y1_in = 50 + 25 * Math.sin(startAngleRad);
    const x2_in = 50 + 25 * Math.cos(endAngleRad);
    const y2_in = 50 + 25 * Math.sin(endAngleRad);

    // Path: Outer Arc -> Line to Inner End -> Inner Arc (Reverse) -> Line to Outer Start
    const d = [
      `M ${x1} ${y1}`,
      `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${x2_in} ${y2_in}`,
      `A 25 25 0 ${largeArcFlag} 0 ${x1_in} ${y1_in}`,
      'Z'
    ].join(' ');

    currentAngle += angle;
    return d;
  };

  return (
    <div className="flex flex-col items-center w-full animate-fade-in-up">
        {/* SVG Chart */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 md:rotate-0">
                {validData.length === 1 ? (
                     <circle cx="50" cy="50" r="32.5" stroke={validData[0].color} strokeWidth="15" fill="transparent" />
                ) : (
                    validData.map((item, i) => (
                        <path 
                            key={i} 
                            d={getPath(item.value, i)} 
                            fill={item.color}
                            stroke="#a3e635" // Lime stroke to blend or separate
                            strokeWidth="0.5"
                            className="hover:opacity-90 transition-opacity duration-300 cursor-pointer"
                        >
                           <title>{item.label}: {Math.round((item.value/total)*100)}%</title>
                        </path>
                    ))
                )}
                {/* Inner Text */}
                 <foreignObject x="25" y="25" width="50" height="50">
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-[8px] text-black/60 uppercase font-bold">Total</div>
                            <div className="text-[10px] font-black text-black truncate px-1">
                                {total < 1000 ? total.toFixed(0) : (total/1000).toFixed(1) + 'k'}
                            </div>
                        </div>
                    </div>
                </foreignObject>
            </svg>
        </div>

        {/* Legend */}
        <div className="w-full grid grid-cols-1 gap-2">
            {validData.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-black/5 border border-black/5">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-3 h-3 rounded-full shrink-0 border border-black/10" style={{ backgroundColor: item.color }}></div>
                        <span className="text-xs font-bold text-black truncate">{item.label}</span>
                    </div>
                    <span className="text-xs font-mono text-black/60 font-bold">
                        {Math.round((item.value/total)*100)}%
                    </span>
                </div>
            ))}
        </div>
    </div>
  );
};

export default ResultChart;