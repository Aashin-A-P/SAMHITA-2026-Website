import React from 'react';
import backgroundImage from '../Login_Sign/5.png';

const AccommodationPage: React.FC = () => {
  return (
    <div 
      className="relative min-h-screen font-sans" 
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Background Image Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      {/* Dark Overlay - Opacity increased to 80% for better contrast */}
      <div className="absolute inset-0 bg-black/80 z-0"></div>
      
      <main className="relative z-10 min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Fix Applied:
             1. text-white: Sets base text color to white.
             2. [&_label]:text-gray-200: Forces all form labels inside to be light gray.
             3. [&_h2]:text-white: Forces headers to be white.
          */}
          <div className="text-center">
            <p className="text-gold-300 text-xl font-semibold">Accommodation Registration</p>
            <p className="text-gray-300 mt-2">Fill out the accommodation form using the button below.</p>
            <div className="mt-6 flex justify-center">
              <a
                href="https://forms.gle/jeuhWE5cdWF7SYJf7"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold bg-gold-500/20 text-gold-200 border border-gold-500/40 hover:bg-gold-500/30 transition"
              >
                Open Accommodation Form
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccommodationPage;


