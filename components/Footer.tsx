
import React from 'react';

interface FooterProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onLoginClick, onSignupClick }) => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
          
          {/* Copyright */}
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} JustDone. All rights reserved.
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#" className="hover:text-primary transition-colors">Tools</a>
            <a href="#" className="hover:text-primary transition-colors">AI Humanizer</a>
            <a href="#" className="hover:text-primary transition-colors">AI Detector</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>

          {/* Auth Links */}
          <div className="flex gap-6 text-sm font-semibold text-gray-900">
             <button onClick={onLoginClick} className="hover:text-primary transition-colors">Log In</button>
             <button onClick={onSignupClick} className="hover:text-primary transition-colors">Sign Up</button>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
    