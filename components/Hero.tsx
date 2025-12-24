
import React from 'react';

interface HeroProps {
  onCtaClick: () => void;
  onLoginClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick, onLoginClick }) => {
  return (
    <section className="pt-32 pb-16 md:pt-48 md:pb-24 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
        
        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
          Your Ultimate <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-brand-gradient">AI Assistant</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
          Plagiarism detector, Text Humanizer, AI Detector, Paraphraser, Grammar Checker, Image Generator, and more...
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={onCtaClick}
            className="w-full sm:w-auto px-8 py-4 bg-brand-gradient text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            Try JustDone
          </button>
          <button 
            onClick={onLoginClick}
            className="w-full sm:w-auto px-8 py-4 bg-white text-gray-600 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
          >
            Log In / Sign Up
          </button>
        </div>

        {/* Social Proof */}
        <div className="pt-8 flex items-center justify-center gap-2 text-sm font-medium text-gray-400">
          <div className="flex -space-x-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
              </div>
            ))}
          </div>
          <span>Trusted by <span className="text-gray-900 font-bold">2M+ Professionals</span></span>
        </div>

      </div>
    </section>
  );
};

export default Hero;
    