
import React from 'react';
import { Button } from '@/components/ui/button';
import type { BreathPattern } from './BreathSelector';
import type { Duration } from './DurationSelector';

interface CompleteScreenProps {
  pattern: BreathPattern;
  duration: Duration;
  onRestart: () => void;
}

const CompleteScreen: React.FC<CompleteScreenProps> = ({
  pattern,
  duration,
  onRestart
}) => {
  const patternName = pattern === 'relaxing' ? '减压' : '专注';
  
  return (
    <div className="space-y-8 text-center">
      <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-muted">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-breathly-blue to-breathly-teal flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-2">练习完成!</h2>
        <p className="text-muted-foreground">
          您已完成 {duration} 分钟{patternName}呼吸练习
        </p>
      </div>
      
      <div>
        <p className="mb-4">感觉如何?</p>
        
        <div className="flex justify-center gap-4 mb-8">
          {['😌', '🙂', '😐', '😔'].map((emoji) => (
            <button 
              key={emoji}
              className="text-2xl p-2 hover:scale-110 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <Button onClick={onRestart} className="button-primary w-full">
          再来一次
        </Button>
        
        <Button onClick={onRestart} variant="outline" className="w-full">
          返回主页
        </Button>
      </div>
    </div>
  );
};

export default CompleteScreen;
