
import React, { useState, useEffect } from 'react';
import { Wind, XCircle } from 'lucide-react';

interface ClarityModeProps {
  onExit: () => void;
}

const ClarityMode: React.FC<ClarityModeProps> = ({ onExit }) => {
  const [step, setStep] = useState(0);
  
  // 90秒情绪沉降模拟流程
  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 3000); // 3s后显示第一句
    const timer2 = setTimeout(() => setStep(2), 10000); // 10s后显示第二句
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-white text-black flex flex-col items-center justify-center p-8 animate-fade-in transition-colors duration-1000">
      
      {/* Exit Button */}
      <button 
        onClick={onExit}
        className="absolute top-8 right-8 text-neutral-400 hover:text-black transition-colors"
      >
        <XCircle size={32} strokeWidth={1} />
      </button>

      {/* Emotion Chamber Logic */}
      <div className="max-w-2xl text-center space-y-12">
        
        <div className="mb-12">
           <Wind size={48} className="mx-auto mb-6 animate-pulse text-neutral-400" strokeWidth={1} />
           <h2 className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-2">CLARITY MODE // 冷静模式</h2>
           <p className="text-neutral-400 text-xs">检测到高认知负荷。正在执行思维重置。</p>
        </div>

        <div className="space-y-8 min-h-[200px]">
           <h1 className={`text-3xl md:text-5xl font-light tracking-tight transition-opacity duration-1000 ${step >= 0 ? 'opacity-100' : 'opacity-0'}`}>
             深呼吸。
           </h1>
           
           <h1 className={`text-2xl md:text-4xl font-light text-neutral-600 transition-opacity duration-1000 delay-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
             这只是一个瞬间，不是你的一生。
           </h1>

           <h1 className={`text-xl md:text-3xl font-light text-neutral-400 transition-opacity duration-1000 delay-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
             现在的关键问题到底是什么？
           </h1>
        </div>

        {step >= 2 && (
          <button 
            onClick={onExit}
            className="mt-16 px-8 py-3 border border-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all duration-500"
          >
            我准备好了
          </button>
        )}
      </div>
    </div>
  );
};

export default ClarityMode;
