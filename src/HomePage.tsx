import { useState, useEffect } from 'react';
import { useLocation, Link} from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from "./ui/Header";
import { FaBullseye, FaEye, FaChevronDown } from "react-icons/fa";


import backgroundImage from './Login_Sign/image.png';
import LoginPage from './Login_Sign/LoginPage';
import SignUpPage from './Login_Sign/SignUpPage';
import ForgotPassword from './Login_Sign/Forgot_Pass';
import Diva from './Photos/Diva.jpg';
import kalkiImage from './Photos/Kalki.jpg';
import Ajay from './Photos/Ajay.jpg';
import Rawin from './Photos/Rawin.jpg';
import Haritha from './Photos/Haritha.jpg';
import Mithun from './Photos/Mithun.jpg';
import Ullas from './Photos/Ullas.jpg';
import Praba from './Photos/Praba.jpg';
import Mouli from './Photos/Mouli.jpg';
import Subramani from './Photos/Subramani.jpg';
import Bhuvanesh from './Photos/Bhuvanesh.jpg';
import Nithin from './Photos/Nithin.jpg';
import Sakthi from './Photos/Sakthi.jpg';
import Salidh from './Photos/Salidh.jpg';
import Sir from './Photos/Sir.jpg';
import Mam from './Photos/Mam.jpeg';
import Kamalesh from './Photos/Kamalesh.jpg';
import Sindhu from './Photos/Sindhu.jpg';
import Zoho from './Photos/Zoho.png';
import Spiro from './Photos/Spiro.jpeg';
import Poorvika from './Photos/Poorvika.png';
import Acer from './Photos/Acer.png';
import Cognizant from './Photos/Cognizant.png';
import Ibm from './Photos/Ibm.png';
import Indian from './Photos/Indian.png';
import Lic from './Photos/Lic.png';
import Ananya from './Photos/Ananya.jpg';
import abinesh from './Photos/abinesh.jpeg';
import vijayashree from './Photos/vijayashree.jpeg';
import aravinth from './Photos/aravinth.jpeg';
import HomePageGallery from './components/HomePageGallery';
import CsmitLogo from './Photos/Logo.png';
import RegistrationTimer from './components/RegistrationTimer';
import OfferBanner from './components/OfferBanner';
import PassesDisplay from './components/PassesDisplay';

// --- Data for different sections ---

const featuredAlumni = [
  { name: "Abinesh R ", dept: "IT", year: 2025, role: "Software Engineer ,Amazon", achievement: "SDE Intern at Amazon.", imageUrl: abinesh },
  { name: "Vijayashree Sridhar", dept: "IT", year: 2023, role: "Member of Technical Staff, Adobe", achievement: "Product Intern at Adobe", imageUrl: vijayashree },
  { name: "Aravinth A", dept: "IT", year: 2026, role: "SDET ,DE Shaw", achievement: "SDET Intern at DE Shaw", imageUrl: aravinth },
];

const achievements = [
  { year: "1983", title: "Inception of CSMIT", description: "CSMIT was founded at Madras Institute of Technology, Anna University, as one of the first student-run computer societies in India." },
  { year: "1990s", title: "Growth of Technical Culture", description: "Expanded its activities into coding contests, technical workshops, and hardware awareness programs across MIT." },
  { year: "2005", title: "Launch of SAMHITA", description: "Started SAMHITA, a national-level open-source technical symposium, drawing students from across India." },
  { year: "2010", title: "Industry Collaborations", description: "Partnered with leading companies to organize technical events, training, and industrial exposure for students." },
  { year: "2020", title: "Digital Transformation", description: "Adopted digital platforms to continue events and coding challenges during the pandemic, ensuring uninterrupted learning." },
  { year: "2024", title: "Legacy of Excellence", description: "Recognized as one of the most active student-run societies, fostering innovation, placements, and leadership at MIT." },
];

const clubMembers = [
    { name: "Rawin S", role: "Chairperson", dept: "IT", email: "shanmugamrawin82@gmail.com", imageUrl:Rawin },
    { name: "Nithin G", role: "Vice Chairperson", dept: "RPT", email: "nithingancsan004@gmail.com", imageUrl: Nithin },
    { name: "Subramanian K", role: "Club Ambassador", dept: "IT", email: "subukarthi29@gmail.com", imageUrl: Subramani },
    { name: "Divakar S", role: "Head of Web Development", dept: "IT", email: "divakardivakar30057@gmail.com", imageUrl: Diva },
    { name: "Bhuvanesh P S", role: "General Secretary-Operations", dept: "PT", email: "psbhuvanesh2005@gmail.com", imageUrl:Bhuvanesh},
    { name: "Kamalesh S", role: "General Secretary-Administration", dept: "PT", email: "kamalesh135@gmail.com", imageUrl: Kamalesh },
    { name: "Kalkidharan KS", role: "Head of Public Relations (PR)", dept: "IT", email: "kskalkidharan@gmail.com", imageUrl: kalkiImage },
    { name: "Ajay R", role: "Guest Relation Officer", dept: "IT", email: "ajayravi250@gmail.com", imageUrl: Ajay },
    { name: "Ullas A U", role: "Treasurer", dept: "IT", email: "ullasullas2187@gmail.com", imageUrl: Ullas },
    { name: "Praba Sree C", role: "Joint Secretary", dept: "RPT", email: "prabasreechellappa@gmail,com", imageUrl: Praba },
    { name: "Haritha K", role: "Executive Director", dept: "IT", email: "harithakandasamy4@gmail.com", imageUrl: Haritha },
    { name: "Ananya V", role: "Executive board member", dept: "IT", email: "ananyavenkat23@gmail.com", imageUrl: Ananya },
    { name: "Mithun Sabari V", role: "Chief Technical Officer", dept: "CT", email: "mithunoffO8@gmail.com", imageUrl: Mithun },
    { name: "Sathivikash S", role: "Director of Events and Planning", dept: "AE", email: "sakthivikash70@gmail.com", imageUrl: Sakthi },
    { name: "Mouli S", role: "Head of Social Media and Digital Engagement", dept: "PT", email: "senthilmouli1978@gmail.com", imageUrl: Mouli },
    { name: "Sindhu J", role: "Creative Director-Design & Visual Media", dept: "IT", email: "sindhu30sindhu30@gmail.com", imageUrl: Sindhu },
    { name: "Mohamed Salih M", role: "Logistic and Operations", dept: "CT", email: "mdsalih.m2005@gmail.com", imageUrl: Salidh },
];

const faculty = [
    { name: "Dr. B. Thanasekhar ", qualification: "Professor & Head, KCC", specialization: "", email: "", imageUrl: Sir },
    { name: "Ms. D. Piratheba ", qualification: "Staff Advisor, CSMIT ", specialization: "", email: "", imageUrl: Mam },
];

const sponsors = [
  { name: 'Zoho', logoUrl: Zoho },
  { name: 'Spiro', logoUrl: Spiro },
  { name: 'Poorvika', logoUrl: Poorvika },
  { name: 'Acer', logoUrl: Acer },
  { name: 'Cognizant', logoUrl: Cognizant },
  { name: 'IBM', logoUrl: Ibm },
  { name: 'Indian', logoUrl: Indian },
  { name: 'LIC', logoUrl: Lic}
];

export default function HomePage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const location = useLocation();
  const { } = useAuth();

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    const handleLoad = () => window.scrollTo(0, 0);
    window.addEventListener('load', handleLoad);

    return () => window.removeEventListener('load', handleLoad);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const handleSwitchToSignUp = () => {
    setIsLoginModalOpen(false);
    setIsSignUpModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsSignUpModalOpen(false);
    setIsForgotPasswordModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleSwitchToForgotPassword = () => {
    setIsLoginModalOpen(false);
    setIsForgotPasswordModalOpen(true);
  };

  

  

  return (
    <>
      <div 
        className="relative min-h-screen font-sans text-gray-200 overflow-x-hidden bg-black"
      >
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url(${backgroundImage})`
          }}
        ></div>

        {/* Overlay Layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/95 z-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.18)_0%,_rgba(0,0,0,0)_60%)] z-0"></div>

        <Header setIsLoginModalOpen={setIsLoginModalOpen} setIsSignUpModalOpen={setIsSignUpModalOpen}  />

        <main className="relative z-10 pt-16">
            <div className="fixed top-16 left-0 w-screen z-20">
            <RegistrationTimer />
            <OfferBanner />
          </div>


            <section id="home" className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative pt-20">
              <img src={CsmitLogo} alt="SAMHITA Logo" className="w-56 md:w-64 h-auto mb-6 drop-shadow-[0_0_35px_rgba(212,175,55,0.45)]" />
              <h1 className="text-4xl md:text-6xl font-bold font-display mb-4 text-gold-gradient">SAMHITA '26</h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl">
                Forging the next generation of technocrats through trials of skill, arenas of competition, and a kingdom where innovation rules.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#about" className="px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-300 gold-button">Explore More</a>
                  <a href="#events" className="px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-300 gold-outline">Learn More</a>
              </div>
            </section>

            <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center bg-black/70 backdrop-blur-md border border-gold-500/30 p-8 rounded-lg gold-glow">
                  <h2 className="text-3xl font-bold font-display mb-6 text-gold-gradient">About SAMHITA</h2>
                  <p className="text-lg text-gray-300 mb-8">
                    SAMHITA, the flagship national-level technical symposium organized by the Information Technology Association, stands as a premier platform for innovation, collaboration, and technical excellence. Designed to bring together aspiring technocrats from across institutions, SAMHITA features a diverse array of competitions, workshops, and knowledge-sharing sessions that challenge creativity and problem-solving skills. Over the years, it has evolved into more than just an event - it is a dynamic forum that nurtures talent, encourages industry interaction, and empowers students to transform their ideas into impactful solutions, shaping them into confident and future-ready professionals.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <div className="bg-black/60 p-6 rounded-lg flex items-start space-x-4 hover:scale-105 transition-transform duration-300 gold-glow">
                      <FaBullseye className="text-gold-400 text-3xl flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-bold text-gold-400 mb-2">Our Mission</h3>
                        <p className="text-gray-300">
                          To cultivate technical excellence, innovation, and collaborative
                          learning by empowering students with the skills and mindset to thrive
                          in the ever-evolving tech landscape.
                        </p>
                      </div>
                    </div>

                  <div className="bg-black/60 p-6 rounded-lg flex items-start space-x-4 hover:scale-105 transition-transform duration-300 gold-glow">
                    <FaEye className="text-gold-400 text-3xl flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-gold-400 mb-2">Our Vision</h3>
                      <p className="text-gray-300">
                        To be the leading society shaping the next generation of tech
                        innovators.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            
                    <HomePageGallery />
                        <section id="events" className="py-20 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold font-display text-center mb-12 text-gold-gradient">Discover the Battlefields</h2>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-5xl mx-auto">
                    <div className="bg-black/70 backdrop-blur-md border border-gold-500/30 p-8 rounded-lg transform transition-transform hover:-translate-y-2 gold-glow">
                        <h3 className="text-2xl font-bold text-white mb-3">SAMHITA</h3>
                        <div className="text-gray-300 mb-4 text-left">
                            <p><span className="font-bold text-gold-400">Type:</span> Annual national-level inter-college technical event.</p>
                            <p><span className="font-bold text-gold-400">Focus:</span> Open source software, technical competitions, and creative problem-solving.</p>
                            <p className="font-bold text-gold-400 mt-2">Highlights:</p>
                            <ul className="list-disc list-inside text-gray-400">
                                <li>Encourages participants to create their own software or tweak existing ones.</li>
                                <li>Large participation since its start in 2005.</li>
                                <li>Huge impact on the free software community in India.</li>
                                <li>Platform for showcasing budding software computing talent.</li>
                            </ul>
                            <p className="mt-2"><span className="font-bold text-gold-400">Purpose:</span> Promote open-source knowledge, inspire innovation, and emphasize open-source importance.</p>
                        </div>
                        <div className="flex gap-4 mt-4">
                            <Link to="/events?symposium=Carteblanche" className="px-5 py-2 rounded-lg text-sm font-semibold gold-outline hover:scale-105 transition-transform">View Events</Link>
                            
                        </div>
                    </div>
                </div>
            </section>
            <section id="why-join" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto text-center bg-black/70 backdrop-blur-md border border-gold-500/30 p-8 rounded-lg gold-glow">
                  <h2 className="text-3xl font-bold font-display mb-6 text-gold-gradient">Why Experience SAMHITA?</h2>
                  <ul className="text-left text-lg text-gray-300 space-y-4 list-disc list-inside">
                    <li>
                      Explore cutting-edge tools, participate in hands-on workshops, and stay ahead in the evolving tech landscape.
                    </li>
                    <li>
                      Strengthen your coding, problem-solving, and analytical abilities through competitive events and challenges.
                    </li>
                    <li>
                      Showcase your talent, collaborate with peers, and gain recognition on a prestigious platform.
                    </li>
                    <li>
                      Develop teamwork, communication, and leadership skills essential for academic and placement success.
                    </li>
                    <li>
                      What You Gain at SAMHITA 2026:
                      <ul className="list-disc list-inside ml-6 text-gray-400">
                        <li>Anna University–affiliated participation certificates</li>
                        <li>Resume-enhancing national-level recognition</li>
                        <li>Cash prizes and rewards for winners</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </section>

            <section id="passes" className="py-20 px-4 sm:px-6 lg:px-8">
              <PassesDisplay />
            </section>

            <section id="sponsors" className="py-20">
              <h2 className="text-3xl font-bold font-display text-center mb-12 text-gold-gradient">The Esteemed Banners of Support</h2>
              <div className="relative w-full overflow-hidden">
                <div className="flex animate-marquee">
                  {[...sponsors, ...sponsors].map((sponsor, index) => (
                    <div key={index} className="flex-shrink-0 w-48 mx-6 flex items-center justify-center">
                      <img 
                        src={sponsor.logoUrl} 
                        alt={sponsor.name} 
                        className="h-12 object-contain transition-all duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>


        </main>

        <footer id="contact" className="py-16 px-6 sm:px-12 bg-black/50 backdrop-blur-md border-t border-gold-500/20 text-gray-400">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 max-w-7xl mx-auto text-center md:text-left">
                <div>
                    <h3 className="text-lg font-bold mb-4 text-white">CSMIT</h3>
                    <p className="text-sm">Fostering the next generation of technologists through innovation and collaboration.</p>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#about" className="hover:text-gold-400 transition">About</a></li>
                        <li><a href="#alumni" className="hover:text-gold-400 transition">Alumni</a></li>
                        <li><a href="#events" className="hover:text-gold-400 transition">Events</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-4 text-white">Contact</h3>
                    <p className="text-sm">Email: <a href="mailto:chairmancsmit@mitindia.edu" className="hover:text-gold-400 transition">chairmancsmit@mitindia.edu</a></p>
                    <p className='text-sm'>Phone: <a href="tel:+91 6374521646" className="hover:text-gold-400 transition">+91 63745 21646</a></p>
                    <p className="text-sm">Address: MIT Campus, Chromepet, Chennai</p>
                </div>
            </div>
            <p className="text-xs text-center border-t border-gold-500/20 pt-8 mt-8">© {new Date().getFullYear()} CSMIT - Computer Society of MIT. All Rights Reserved.</p>
        </footer>

        <LoginPage 
            isOpen={isLoginModalOpen} 
            onClose={() => setIsLoginModalOpen(false)} 
            onSwitchToSignUp={handleSwitchToSignUp} 
            onSwitchToForgotPassword={handleSwitchToForgotPassword} 
        />
        <SignUpPage 
            isOpen={isSignUpModalOpen} 
            onClose={() => setIsSignUpModalOpen(false)} 
            onSwitchToLogin={handleSwitchToLogin} 
        />
        <ForgotPassword 
            isOpen={isForgotPasswordModalOpen} 
            onClose={() => setIsForgotPasswordModalOpen(false)} 
            onSwitchToLogin={handleSwitchToLogin} 
        />
      </div>
    </>
  );
}


