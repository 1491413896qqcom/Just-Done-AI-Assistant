
import React from 'react';
import { JobStatus, ProcessingStage } from '../types';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

interface ProcessingStatusProps {
  status: JobStatus;
  progress: number; // 0-100
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ status, progress }) => {
  const steps = [
    { id: ProcessingStage.UPLOAD, label: 'Uploading' },
    { id: ProcessingStage.QUEUE, label: 'Queued' },
    { id: ProcessingStage.ANALYZE, label: 'Processing' },
    { id: ProcessingStage.FINALIZE, label: 'Finalizing' },
  ];

  const getCurrentStepIndex = () => {
    switch (status) {
      case JobStatus.UPLOADING: return 0;
      case JobStatus.QUEUED: return 1;
      case JobStatus.PROCESSING: return 2;
      case JobStatus.COMPLETED: return 4; // All done
      default: return -1;
    }
  };

  const activeIndex = getCurrentStepIndex();

  if (status === JobStatus.IDLE || status === JobStatus.FAILED) return null;

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          {status === JobStatus.COMPLETED ? (
            <span className="text-green-500 flex items-center gap-1"><CheckCircle2 size={16} /> Analysis Complete</span>
          ) : (
            <span className="text-blue-500 flex items-center gap-1"><Loader2 size={16} className="animate-spin" /> Processing Job...</span>
          )}
        </h3>
        <span className="text-xs text-gray-500 font-mono">{progress}%</span>
      </div>

      {/* Stepper */}
      <div className="relative flex justify-between">
        {/* Connector Line */}
        <div className="absolute top-2.5 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>
        <div 
          className="absolute top-2.5 left-0 h-0.5 bg-brand-gradient transition-all duration-500 -z-10"
          style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, idx) => {
          const isActive = idx <= activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div 
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all
                  ${isActive 
                    ? 'bg-white border-teal text-teal shadow-sm' 
                    : 'bg-white border-gray-200 text-gray-300'}
                  ${isCurrent && status !== JobStatus.COMPLETED ? 'animate-pulse ring-4 ring-teal/10' : ''}
                `}
              >
                {isActive ? <CheckCircle2 size={12} fill="currentColor" className="text-teal bg-white" /> : <Circle size={12} />}
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-semibold transition-colors ${isActive ? 'text-gray-800' : 'text-gray-300'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessingStatus;
