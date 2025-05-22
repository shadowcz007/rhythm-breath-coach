
import React from 'react';
import { cn } from '@/lib/utils';

export type BreathPattern = 'relaxing' | 'focus';

interface BreathSelectorProps {
  selected: BreathPattern;
  onSelect: (pattern: BreathPattern) => void;
}

const BreathSelector: React.FC<BreathSelectorProps> = ({ 
  selected, 
  onSelect 
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center mb-6">选择呼吸模式</h2>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          onClick={() => onSelect('relaxing')}
          className={cn(
            "breath-option", 
            selected === 'relaxing' ? 'active' : ''
          )}
        >
          <div className="w-20 h-20 mb-3 flex items-center justify-center rounded-full bg-muted">
            <div className="w-12 h-12 animate-pulse-gentle rounded-full bg-gradient-to-r from-breathly-blue to-breathly-teal" />
          </div>
          <h3 className="text-lg font-medium">减压模式</h3>
          <p className="text-sm text-muted-foreground mt-1">4-7-8呼吸法</p>
        </button>
        
        <button
          onClick={() => onSelect('focus')}
          className={cn(
            "breath-option", 
            selected === 'focus' ? 'active' : ''
          )}
        >
          <div className="w-20 h-20 mb-3 flex items-center justify-center rounded-full bg-muted">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-breathly-teal to-breathly-blue relative">
              <div className="absolute inset-2 rounded-sm bg-muted" />
            </div>
          </div>
          <h3 className="text-lg font-medium">专注模式</h3>
          <p className="text-sm text-muted-foreground mt-1">箱式呼吸法</p>
        </button>
      </div>
    </div>
  );
};

export default BreathSelector;
