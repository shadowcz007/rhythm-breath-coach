
import React from 'react';
import { cn } from '@/lib/utils';

export type Duration = 3 | 5 | 10;

interface DurationSelectorProps {
  selected: Duration;
  onSelect: (duration: Duration) => void;
}

const DurationSelector: React.FC<DurationSelectorProps> = ({ 
  selected, 
  onSelect 
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center mb-6">选择时长</h2>
      
      <div className="flex justify-center gap-4">
        {[3, 5, 10].map((duration) => (
          <button
            key={duration}
            onClick={() => onSelect(duration as Duration)}
            className={cn(
              "duration-option", 
              selected === duration ? 'active' : ''
            )}
          >
            <span className="text-lg font-medium">{duration}</span>
            <span className="text-sm ml-1">分钟</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DurationSelector;
