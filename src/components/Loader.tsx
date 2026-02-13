import React from 'react';
import { createPortal } from 'react-dom';
import loaderBackground from '../Login_Sign/6.png';

const Loader: React.FC = () => {
  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50 relative">
      <img
        src={loaderBackground}
        alt=""
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black/20 z-10"></div>
      <div className="relative z-20 flex justify-center items-center">
        <div className="absolute w-24 h-24 rounded-full animate-ping-slow border-4 border-gold-400"></div>
        <div className="absolute w-16 h-16 rounded-full animate-ping-slow border-4 border-gold-500" style={{ animationDelay: '-0.5s' }}></div>
        <div className="absolute w-8 h-8 rounded-full animate-ping-slow border-4 border-samhita-600" style={{ animationDelay: '-1s' }}></div>
      </div>
      <style>{`
        @keyframes ping-slow {
          0%, 100% {
            transform: scale(0.2);
            opacity: 0.2;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>,
    document.body
  );
};

export default Loader;



