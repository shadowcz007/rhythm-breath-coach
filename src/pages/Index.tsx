
import React, { useState } from 'react';
import BreathSelector, { BreathPattern } from '@/components/BreathSelector';
import DurationSelector, { Duration } from '@/components/DurationSelector';
import BreathingExercise from '@/components/BreathingExercise';
import CompleteScreen from '@/components/CompleteScreen';
import { Button } from '@/components/ui/button';
import { initAudio } from '@/utils/audioUtils';

type Step = 'pattern' | 'duration' | 'exercise' | 'complete';

const Index = () => {
  const [step, setStep] = useState<Step>('pattern');
  const [pattern, setPattern] = useState<BreathPattern>('relaxing');
  const [duration, setDuration] = useState<Duration>(5);
  
  const handleStart = () => {
    // Initialize audio context on user interaction
    initAudio();
    setStep('exercise');
  };
  
  const handlePatternSelect = (selected: BreathPattern) => {
    setPattern(selected);
    // Auto-advance to duration selection
    setStep('duration');
  };
  
  const handleComplete = (pattern: BreathPattern, duration: Duration) => {
    setStep('complete');
  };
  
  const handleRestart = () => {
    setStep('pattern');
  };
  
  // Render appropriate step
  const renderStep = () => {
    switch (step) {
      case 'pattern':
        return (
          <BreathSelector
            selected={pattern}
            onSelect={handlePatternSelect}
          />
        );
        
      case 'duration':
        return (
          <>
            <DurationSelector
              selected={duration}
              onSelect={setDuration}
            />
            <div className="mt-8">
              <Button onClick={handleStart} className="button-primary">
                开始练习
              </Button>
              <Button 
                onClick={() => setStep('pattern')} 
                variant="outline"
                className="mt-4 button-secondary"
              >
                返回
              </Button>
            </div>
          </>
        );
        
      case 'exercise':
        return (
          <BreathingExercise
            pattern={pattern}
            duration={duration}
            onComplete={handleComplete}
          />
        );
        
      case 'complete':
        return (
          <CompleteScreen
            pattern={pattern}
            duration={duration}
            onRestart={handleRestart}
          />
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="breathly-container">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-breathly-blue to-breathly-teal bg-clip-text text-transparent">
          Breathly
        </h1>
        <p className="text-muted-foreground mt-1">呯吸练习</p>
      </header>
      
      <main className="breathly-card">
        {renderStep()}
      </main>
      
      {step === 'pattern' && (
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>深呼吸帮助您减轻压力并提高专注力</p>
          <p className="mt-1">每天练习以获得最佳效果</p>
        </footer>
      )}
    </div>
  );
};

export default Index;
