
import React from 'react';
import { EmotionState, BiasWarning } from '../types';
import { Activity, AlertTriangle } from 'lucide-react';

interface EmotionBarProps {
  emotion: EmotionState;
  bias: BiasWarning | null;
}

const EmotionBar: React.FC<EmotionBarProps> = ({ emotion, bias }) => {
  // Simple color mapping for emotion intensity
  const getColor = (intensity: number) => {
    if (intensity > 70) return 'text-red-500';
    if (intensity > 40) return 'text-yellow-500';
    return 'text-blue-500';
  };

  return (
    <div className="h-14 bg-black border-t border-neutral-800 flex items-center px-4 md:px-8 justify-between w-full shrink-0 z-50">
      
      {/* Left: Emotion Status */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
           <Activity className={`${getColor(emotion.intensity)} animate-pulse`} size={18} />
           <div>
             <div className="flex items-baseline gap-2">
               <span className={`text-sm font-bold ${getColor(emotion.intensity)}`}>{emotion.type}</span>
               <span className="text-xs text-neutral-500 font-mono">{emotion.intensity}%</span>
             </div>
           </div>
        </div>

        {/* Sparkline (Simulated visualization) */}
        <div className="hidden md:flex items-end h-8 gap-1 opacity-50">
          {emotion.trend.map((val, idx) => (
             <div 
               key={idx} 
               className={`w-1 rounded-t-sm ${val > 60 ? 'bg-red-500' : 'bg-neutral-600'}`} 
               style={{ height: `${val}%` }}
             ></div>
          ))}
        </div>

        {/* Trigger Message */}
        {emotion.triggerKeyword && (
           <div className="hidden md:block text-[10px] text-neutral-400 bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
             {emotion.systemComment}
           </div>
        )}
      </div>

      {/* Right: Bias Alert */}
      {bias && (
        <div className="flex items-center gap-2 text-yellow-600 bg-yellow-900/10 px-3 py-1 rounded border border-yellow-900/30">
          <AlertTriangle size={12} />
          <span className="text-[10px] uppercase tracking-wider font-bold">{bias.type} 检测到</span>
        </div>
      )}
    </div>
  );
};

export default EmotionBar;
