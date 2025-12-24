import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ToolsGrid from './components/ToolsGrid';
import Footer from './components/Footer';
import PricingPage from './components/PricingPage';
import ToolWorkspace from './components/ToolWorkspace';
import AuthModal from './components/AuthModal';
import SettingsModal from './components/SettingsModal';
import { ToolId } from './types';

type View = 'HOME' | 'PRICING' | 'TOOL';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    // 检查本地存储中是否存在 API Key
    const key = localStorage.getItem('JUSTDONE_API_KEY');
    if (!key) {
      // 如果没有密钥，延迟 1.5 秒后自动打开设置弹窗提示用户输入
      const timer = setTimeout(() => setIsSettingsModalOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleToolSelect = (id: ToolId) => {
    setActiveTool(id);
    setCurrentView('TOOL');
    window.scrollTo(0, 0);
  };

  const handleNavClick = (view: View) => {
    setCurrentView(view);
    setActiveTool(null);
    window.scrollTo(0, 0);
  };

  const openLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const openSignup = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen font-sans bg-white selection:bg-secondary selection:text-white">
      <AuthModal 
        isOpen={isAuthModalOpen} 
        initialMode={authMode} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      
      <SettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)} 
      />

      {currentView !== 'TOOL' && (
        <Header 
          onNavClick={(dest) => {
             if (dest === 'pricing') handleNavClick('PRICING');
             if (dest === 'home') handleNavClick('HOME');
          }}
          onLoginClick={openLogin}
          onSignupClick={openSignup}
          onSettingsClick={() => setIsSettingsModalOpen(true)}
        />
      )}

      {currentView === 'HOME' && (
        <main>
          <Hero 
            onCtaClick={() => {
              const el = document.getElementById('tools');
              el?.scrollIntoView({ behavior: 'smooth' });
            }} 
            onLoginClick={openLogin}
          />
          <ToolsGrid onSelectTool={handleToolSelect} />
          
          <section className="py-20 px-4">
            <div className="max-w-5xl mx-auto rounded-3xl bg-brand-gradient p-12 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="relative z-10 space-y-8">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                  体验全能 AI 工具集，立即开始。
                </h2>
                <button 
                  onClick={() => handleToolSelect(ToolId.HUMANIZER)}
                  className="px-10 py-4 bg-white text-secondary rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  立即尝试 JustDone
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {currentView === 'PRICING' && (
        <PricingPage onBack={() => handleNavClick('HOME')} />
      )}

      {currentView === 'TOOL' && activeTool && (
        <ToolWorkspace toolId={activeTool} onBack={() => handleNavClick('HOME')} />
      )}

      {currentView === 'HOME' && (
        <Footer 
          onLoginClick={openLogin}
          onSignupClick={openSignup}
        />
      )}
    </div>
  );
};

export default App;