import React, { useState, useEffect } from 'react';
import { X, Shield, Cpu, RefreshCw, Check, AlertCircle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKeyStatus, setApiKeyStatus] = useState<'active' | 'configuring'>('active');
  const [activeTab, setActiveTab] = useState<'connection' | 'preference'>('connection');

  if (!isOpen) return null;

  const handleModifyKey = () => {
    // In a real logic, we'd trigger the system injection or local storage read
    // For this UI demo, we show the modification intent
    setApiKeyStatus('configuring');
    setTimeout(() => {
      setApiKeyStatus('active');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-[#0a0a0a] border border-neutral-800 rounded-sm shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in text-white">
        {/* Header */}
        <div className="px-8 py-6 border-b border-neutral-900 flex justify-between items-center">
          <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-neutral-400">System Settings // 系统设置</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <X size={20} strokeWidth={1} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-900">
          <button 
            onClick={() => setActiveTab('connection')}
            className={`flex-1 py-3 text-[10px] uppercase tracking-widest transition-all ${activeTab === 'connection' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-400'}`}
          >
            Connection
          </button>
          <button 
            onClick={() => setActiveTab('preference')}
            className={`flex-1 py-3 text-[10px] uppercase tracking-widest transition-all ${activeTab === 'preference' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-400'}`}
          >
            Preferences
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {activeTab === 'connection' && (
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-neutral-900/50 border border-neutral-800 rounded-sm">
                <Shield className="text-blue-500 mt-1" size={20} />
                <div>
                  <h3 className="text-[11px] uppercase tracking-wider font-bold text-neutral-200">Gemini API Protocol</h3>
                  <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed">
                    Secure connection established via platform environment variables. Identity verified and traffic encrypted.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-600">Connection Status</span>
                  <span className="flex items-center gap-1.5 text-[10px] text-green-500 font-bold uppercase tracking-wider">
                    <Check size={12} /> Active
                  </span>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-600 block">Security Key Management</label>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-neutral-900 border border-neutral-800 px-4 py-2 text-[10px] font-mono text-neutral-500 flex items-center">
                      ••••••••••••••••••••••••••••••••
                    </div>
                    <button 
                      onClick={handleModifyKey}
                      className="px-4 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center gap-2"
                    >
                      {apiKeyStatus === 'configuring' ? <RefreshCw size={12} className="animate-spin" /> : 'Modify Key'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-900/10 border border-blue-900/30 rounded-sm flex items-start gap-2">
                <AlertCircle size={14} className="text-blue-400 mt-0.5" />
                <p className="text-[9px] text-blue-300 leading-normal">
                  Modifying connection keys will reset the active thinking engine session. Ensure all progress is saved.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'preference' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Diagnostic Mode</span>
                <div className="w-10 h-5 bg-neutral-800 rounded-full relative cursor-pointer">
                  <div className="absolute top-1 left-1 w-3 h-3 bg-neutral-500 rounded-full"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Auto-Save History</span>
                <div className="w-10 h-5 bg-white rounded-full relative cursor-pointer">
                  <div className="absolute top-1 right-1 w-3 h-3 bg-black rounded-full"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-neutral-900/50 border-t border-neutral-900 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-2 text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="px-8 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all">
            Confirm Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;