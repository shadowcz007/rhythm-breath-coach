import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playCompletionSound, playTransitionSound } from '@/utils/audioUtils';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';
import type { BreathPattern } from './BreathSelector';
import type { Duration } from './DurationSelector';

interface BreathingExerciseProps {
  pattern: BreathPattern;
  duration: Duration;
  onComplete: (pattern: BreathPattern, duration: Duration) => void;
}

type BreathState = 'inhale' | 'hold1' | 'exhale' | 'hold2';

const BreathingExercise: React.FC<BreathingExerciseProps> = ({
  pattern,
  duration,
  onComplete
}) => {
  const [seconds, setSeconds] = useState(duration * 60);
  const [breathState, setBreathState] = useState<BreathState>('inhale');
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();
  
  // Animation parameters based on pattern
  const patternConfig = {
    relaxing: {
      inhale: 4,
      hold1: 7,
      exhale: 8,
      hold2: 0
    },
    focus: {
      inhale: 4,
      hold1: 4,
      exhale: 4,
      hold2: 4
    }
  };
  
  const config = patternConfig[pattern];
  const circleRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Current breath cycle time counter
  const breathTimerRef = useRef<number>(0);
  
  // Format remaining time as MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Instruction text based on current breath state
  const getInstructionText = () => {
    switch (breathState) {
      case 'inhale': return '吸气';
      case 'hold1': return '屏息';
      case 'exhale': return '呼气';
      case 'hold2': return '屏息';
      default: return '';
    }
  };
  
  const lastTimeRef = useRef<number>(0);

  // Animation function using requestAnimationFrame
  const animate = useCallback((timestamp: number) => {
    if (isPaused || !circleRef.current) return;
    
    // 首次运行时初始化lastTime
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = timestamp;
    }
    
    // 计算实际的时间差（秒）
    const deltaTime = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;
    
    // 使用实际时间差更新呼吸计时器
    breathTimerRef.current += deltaTime;
    
    const circle = circleRef.current;
    
    // Handle state transitions based on breath timer
    if (breathState === 'inhale' && breathTimerRef.current >= config.inhale) {
      setBreathState('hold1');
      breathTimerRef.current = 0;
      playTransitionSound();
    } else if (breathState === 'hold1' && breathTimerRef.current >= config.hold1) {
      setBreathState('exhale');
      breathTimerRef.current = 0;
      playTransitionSound();
    } else if (breathState === 'exhale' && breathTimerRef.current >= config.exhale) {
      if (config.hold2 > 0) {
        setBreathState('hold2');
        breathTimerRef.current = 0;
        playTransitionSound();
      } else {
        setBreathState('inhale');
        breathTimerRef.current = 0;
        playTransitionSound();
      }
    } else if (breathState === 'hold2' && breathTimerRef.current >= config.hold2) {
      setBreathState('inhale');
      breathTimerRef.current = 0;
      playTransitionSound();
    }
    
    // Animation logic based on breath state
    if (breathState === 'inhale') {
      const progress = Math.min(breathTimerRef.current / config.inhale, 1);
      const scale = 1 + (0.5 * progress);
      circle.style.transform = `scale(${scale})`;
      circle.style.opacity = `${0.7 + (0.3 * progress)}`;
    } 
    else if (breathState === 'exhale') {
      const progress = Math.min(breathTimerRef.current / config.exhale, 1);
      const scale = 1.5 - (0.5 * progress);
      circle.style.transform = `scale(${scale})`;
      circle.style.opacity = `${1 - (0.3 * progress)}`;
    }
    // For hold states, we keep the circle as is
    
    animationRef.current = requestAnimationFrame(animate);
  }, [breathState, config, isPaused]);
  
  // Start the exercise
  useEffect(() => {
    // Start the main timer
    timerRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          // Session complete
          clearInterval(timerRef.current as NodeJS.Timeout);
          cancelAnimationFrame(animationRef.current);
          playCompletionSound();
          onComplete(pattern, duration);
          return 0;
        }
        return isPaused ? prev : prev - 1;
      });
    }, 1000);
    
    // Start the animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Play transition sound at start
    playTransitionSound();
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate, duration, isPaused, onComplete, pattern]);
  
  const togglePause = () => {
    setIsPaused(prev => !prev);
    
    if (!isPaused) {
      cancelAnimationFrame(animationRef.current);
      toast("练习已暂停", {
        description: "您可以随时继续练习"
      });
    } else {
      animationRef.current = requestAnimationFrame(animate);
      toast("练习已继续", {
        description: "继续专注于您的呼吸"
      });
    }
  };
  
  const exitExercise = () => {
    navigate('/');
    toast("练习已结束", {
      description: "您可以随时回来继续练习"
    });
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-center">
          {pattern === 'relaxing' ? '减压模式' : '专注模式'}
        </h2>
        <p className="text-sm text-muted-foreground text-center">
          {formatTime(seconds)} 剩余
        </p>
      </div>
      
      <div className="relative flex items-center justify-center w-64 h-64 mb-12">
        <div 
          ref={circleRef} 
          className="breathe-circle w-32 h-32"
        />
        <div className="breathe-text">
          {getInstructionText()}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        <Button 
          variant="outline" 
          onClick={togglePause}
          className="w-full"
        >
          {isPaused ? '继续' : '暂停'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={exitExercise} 
          className="w-full"
        >
          退出
        </Button>
      </div>
    </div>
  );
};

export default BreathingExercise;
