import React from 'react';

interface HeroProps {
  onCtaClick: () => void;
  onLoginClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick, onLoginClick }) => {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-50 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-teal/5 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2 opacity-60"></div>

      <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          全新一代 AI 写作引擎已上线
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
          您的终极 <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-brand-gradient">AI 决策助手</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          集文本人性化、AI 检测、论文查重于一体。 <br/>
          通过精准的数据流分析，为您的决策提供全方位智力支持。
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <button 
            onClick={onCtaClick}
            className="w-full sm:w-auto px-10 py-4 bg-primary text-white rounded-full font-bold text-lg shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300"
          >
            开启任务
          </button>
          <button 
            onClick={onLoginClick}
            className="w-full sm:w-auto px-10 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-all duration-300"
          >
            身份验证
          </button>
        </div>

        {/* Trust Badges */}
        <div className="pt-16 flex flex-col items-center gap-4 opacity-40 grayscale">
          <p className="text-xs uppercase tracking-widest font-bold text-gray-400">Trusted by modern teams</p>
          <div className="flex gap-8 md:gap-16 items-center">
             <div className="font-black text-xl italic">DATABRICKS</div>
             <div className="font-black text-xl italic">OPENAI</div>
             <div className="font-black text-xl italic">STRIPE</div>
             <div className="font-black text-xl italic">NOTION</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;