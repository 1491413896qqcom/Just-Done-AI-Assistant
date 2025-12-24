import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Settings } from 'lucide-react';

interface HeaderProps {
  onNavClick: (dest: 'home' | 'pricing' | 'tools') => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavClick, onLoginClick, onSignupClick, onSettingsClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'glass-nav border-b border-gray-100 shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => onNavClick('home')}
        >
          <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center text-white font-bold text-lg">
            J
          </div>
          <span className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-gray-900' : 'text-gray-900'}`}>JustDone</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => onNavClick('home')} className="text-gray-600 hover:text-primary font-medium transition-colors">AI 工具</button>
          <button onClick={() => onNavClick('pricing')} className="text-gray-600 hover:text-primary font-medium transition-colors">价格</button>
          <button onClick={() => onNavClick('home')} className="text-gray-600 hover:text-primary font-medium transition-colors">关于我们</button>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={onSettingsClick}
            className="p-2 text-gray-400 hover:text-primary transition-all rounded-full hover:bg-gray-100"
            title="API 设置"
          >
            <Settings size={20} strokeWidth={1.5} />
          </button>
          <button 
            onClick={onLoginClick}
            className="text-gray-600 hover:text-primary font-semibold text-sm px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
          >
            登录
          </button>
          <button onClick={() => onNavClick('home')} className="bg-brand-gradient text-white px-6 py-2.5 rounded-full font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            免费试用
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-gray-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl py-4 px-4 flex flex-col gap-4">
          <span onClick={() => {onNavClick('home'); setMobileMenuOpen(false)}} className="text-gray-600 font-medium py-2 border-b border-gray-50">AI 工具</span>
          <span onClick={() => {onNavClick('pricing'); setMobileMenuOpen(false)}} className="text-gray-600 font-medium">价格</span>
          <div className="flex flex-col gap-3 mt-2">
             <button onClick={() => {onSettingsClick(); setMobileMenuOpen(false)}} className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-full font-semibold">API 设置</button>
             <button onClick={() => {onLoginClick(); setMobileMenuOpen(false)}} className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-full font-semibold hover:bg-gray-50">登录</button>
             <button onClick={() => {onNavClick('home'); setMobileMenuOpen(false)}} className="w-full bg-primary text-white py-2.5 rounded-full font-semibold shadow-lg">免费注册</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;