import React from 'react';
import { motion } from 'framer-motion';

interface RadarData {
  label: string;
  value: number; // 0 to 100
  fullMark: number;
}

interface RadarChartProps {
  data: RadarData[];
  width?: number;
  height?: number;
  fillColor?: string;
  strokeColor?: string;
}

const RadarChart: React.FC<RadarChartProps> = ({ 
  data, 
  width = 200, 
  height = 200,
  fillColor = 'rgba(99, 102, 241, 0.4)', // Slate Blue with opacity
  strokeColor = '#D4FF3F' // Volt Yellow
}) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) - 25; // Padding for labels
  const angleSlice = (Math.PI * 2) / data.length;

  // Helper to calculate coordinates
  const getCoordinates = (value: number, index: number) => {
    const angle = index * angleSlice - Math.PI / 2; // Start from top
    const r = (value / 100) * radius;
    return {
      x: centerX + Math.cos(angle) * r,
      y: centerY + Math.sin(angle) * r
    };
  };

  // Generate polygon points for the data
  const points = data.map((d, i) => {
    const { x, y } = getCoordinates(d.value, i);
    return `${x},${y}`;
  }).join(' ');

  // Generate grid levels (concentric polygons)
  const levels = [25, 50, 75, 100];

  return (
    <div className="relative flex justify-center items-center">
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid Levels */}
        {levels.map((level, i) => (
          <polygon
            key={i}
            points={data.map((_, index) => {
              const { x, y } = getCoordinates(level, index);
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="1"
            className="dark:stroke-gray-700"
          />
        ))}

        {/* Axes */}
        {data.map((_, i) => {
          const { x, y } = getCoordinates(100, i);
          return (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="#E5E7EB"
              strokeWidth="1"
              className="dark:stroke-gray-700"
            />
          );
        })}

        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4FF3F" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Data Area */}
        <motion.polygon
          points={points}
          fill="url(#radarGradient)"
          stroke={strokeColor}
          strokeWidth={2}
          strokeLinejoin="round"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, points: points }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Data Points */}
        {data.map((d, i) => {
          const { x, y } = getCoordinates(d.value, i);
          return (
            <g key={i}>
               <motion.circle
                cx={x}
                cy={y}
                r={3}
                fill="black"
                stroke="white"
                strokeWidth={1.5}
                initial={{ scale: 0 }}
                animate={{ cx: x, cy: y, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              />
              {/* Labels - positioned slightly outside */}
              <text
                x={x}
                y={y}
                dy={y < centerY ? -12 : 22}
                dx={x < centerX ? -10 : 10}
                textAnchor="middle"
                className="text-[9px] font-bold fill-gray-400 uppercase tracking-wider"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default RadarChart;