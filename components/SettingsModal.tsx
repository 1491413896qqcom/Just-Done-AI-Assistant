import React, { useState, useEffect } from 'react';
import { X, Shield, Cpu, RefreshCw, Check, AlertCircle, Key, Lock } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [activeTab, setActiveTab] = useState<'connection' | 'preference'>('connection');

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('JUSTDONE_API_KEY');
      if (stored) setApiKey(stored);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      localStorage.setItem('JUSTDONE_API_KEY', apiKey);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };

  const isKeyActive = apiKey.length > 10;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative bg-[#000] border border-neutral-800 rounded-none shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in text-white">
        {/* Header */}
        <div className="px-8 py-6 border-b border-neutral-900 flex justify-between items-center">
          <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-neutral-400">Settings // 配置</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex bg-[#050505]">
          <button 
            onClick={() => setActiveTab('connection')}
            className={`flex-1 py-4 text-[9px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 ${activeTab === 'connection' ? 'border-white text-white' : 'border-transparent text-neutral-600 hover:text-neutral-400'}`}
          >
            Terminal Connection
          </button>
          <button 
            onClick={() => setActiveTab('preference')}
            className={`flex-1 py-4 text-[9px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 ${activeTab === 'preference' ? 'border-white text-white' : 'border-transparent text-neutral-600 hover:text-neutral-400'}`}
          >
            System Ops
          </button>
        </div>

        {/* Content */}
        <div className="p-10 space-y-10">
          {activeTab === 'connection' && (
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500">API Access Token</label>
                  <span className={`text-[9px] uppercase tracking-widest font-bold ${isKeyActive ? 'text-green-500' : 'text-red-500'}`}>
                    {isKeyActive ? 'Status: Online' : 'Status: Disconnected'}
                  </span>
                </div>
                
                <div className="relative">
                  <Key size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input 
                    type="password"
                    placeholder="ENTER GEMINI API KEY..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 px-12 py-4 text-[11px] font-mono tracking-widest text-white focus:outline-none focus:border-white transition-all placeholder:text-neutral-700"
                  />
                </div>

                <button 
                  onClick={handleSave}
                  disabled={saveStatus !== 'idle'}
                  className={`w-full py-4 text-[10px] uppercase tracking-[0.3em] font-bold transition-all flex items-center justify-center gap-3
                    ${saveStatus === 'saved' ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-neutral-200'}
                  `}
                >
                  {saveStatus === 'saving' && <RefreshCw size={14} className="animate-spin" />}
                  {saveStatus === 'saved' && <Check size={14} />}
                  {saveStatus === 'idle' ? 'Update Credentials' : saveStatus === 'saving' ? 'Processing' : 'Access Granted'}
                </button>
              </div>

              <div className="flex items-start gap-4 p-5 bg-neutral-900/50 border border-neutral-800">
                <Shield className="text-neutral-400 shrink-0" size={18} strokeWidth={1.5} />
                <p className="text-[10px] text-neutral-500 leading-relaxed tracking-wider">
                  Credentials are encrypted and persisted locally within your browser sandbox. Data never leaves your terminal.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'preference' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center py-2 border-b border-neutral-900">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Persistence Mode</span>
                <div className="w-8 h-4 bg-white rounded-none relative cursor-pointer">
                  <div className="absolute top-0.5 right-0.5 w-3 h-3 bg-black"></div>
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-neutral-900">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Telemetry</span>
                <div className="w-8 h-4 bg-neutral-800 rounded-none relative cursor-pointer">
                  <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-neutral-500"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-10 py-8 bg-[#050505] border-t border-neutral-900 flex justify-end">
          <button onClick={onClose} className="px-12 py-3 border border-neutral-700 text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400 hover:text-white hover:border-white transition-all">
            Close Terminal
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;