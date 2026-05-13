'use client';

import { motion } from 'framer-motion';

interface LatencyTrendProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}

export const LatencyTrend = ({ 
  data, 
  color = '#3b82f6', 
  height = 40, 
  width = 120 
}: LatencyTrendProps) => {
  if (!data || data.length < 2) return null;

  const maxValue = Math.max(...data, 100);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - minValue) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative" style={{ width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id="gradient-latency" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area Fill */}
        <motion.path
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          d={`M 0,${height} ${data.map((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((val - minValue) / range) * height;
            return `L ${x},${y}`;
          }).join(' ')} L ${width},${height} Z`}
          fill="url(#gradient-latency)"
        />

        {/* Line Path */}
        <motion.polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        
        {/* Current Point Dot */}
        <motion.circle
          cx={width}
          cy={height - ((data[data.length - 1] - minValue) / range) * height}
          r="3"
          fill={color}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="shadow-sm"
        />
      </svg>
    </div>
  );
};
