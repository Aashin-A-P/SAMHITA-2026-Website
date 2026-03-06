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
          <div className="text-center">
            <p className="text-gold-300 text-xl font-semibold">Accommodation</p>
            <p className="text-gray-300 mt-3 text-lg">
              For Accomodations, contact{" "}
              <a href="tel:+916374327796" className="text-gold-300 hover:text-gold-200 underline">
                +916374327796
              </a>{" "}
              or{" "}
              <a href="tel:+916382944774" className="text-gold-300 hover:text-gold-200 underline">
                +916382944774
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccommodationPage;


