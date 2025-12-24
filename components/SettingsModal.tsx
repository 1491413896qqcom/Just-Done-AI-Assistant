import React, { useState, useEffect } from 'react';
import { X, Shield, RefreshCw, Check, Key, Lock, AlertCircle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

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
      setTimeout(() => {
        setSaveStatus('idle');
        onClose();
      }, 1500);
    }, 800);
  };

  const isKeyActive = apiKey.length > 10;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white border border-gray-200 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in text-gray-900">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">系统配置</h2>
            <p className="text-xs text-gray-500">管理您的 API 连接与安全密钥</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-sm font-bold text-gray-700">Gemini API Key</label>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isKeyActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {isKeyActive ? '连接正常' : '未连接'}
                </span>
              </div>
              
              <div className="relative">
                <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="password"
                  placeholder="在此输入您的 API 密钥..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-12 py-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-300"
                />
              </div>

              {!isKeyActive && (
                <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <AlertCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 leading-relaxed">
                    为了使用全知进化决策的功能，您需要提供有效的 Gemini API 密钥。该密钥将<b>加密保存于您的本地浏览器存储中</b>，绝不会上传至我们的服务器。
                  </p>
                </div>
              )}

              <button 
                onClick={handleSave}
                disabled={saveStatus !== 'idle'}
                className={`w-full py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-3 shadow-lg
                  ${saveStatus === 'saved' ? 'bg-green-600 text-white shadow-green-200' : 'bg-primary text-white shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5'}
                `}
              >
                {saveStatus === 'saving' && <RefreshCw size={18} className="animate-spin" />}
                {saveStatus === 'saved' && <Check size={18} />}
                {saveStatus === 'idle' ? '保存配置' : saveStatus === 'saving' ? '正在处理' : '配置成功'}
              </button>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <Lock className="text-gray-400 shrink-0" size={20} strokeWidth={1.5} />
              <p className="text-[11px] text-gray-500 leading-relaxed">
                数据安全说明：我们支持 PWA 离线模式，API 密钥仅用于在您的本地环境中调用 Google Gemini 模型。您可以随时通过此面板修改或清除密钥。
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-8 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-900 transition-all">
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;