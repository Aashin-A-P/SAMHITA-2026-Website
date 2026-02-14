import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from "./ui/Header";
import { FaBullseye, FaEye, FaChevronDown } from "react-icons/fa";
import API_BASE_URL from './Config';


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
import ThemedModal from './components/ThemedModal';

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
  const [activeEventTab, setActiveEventTab] = useState<'Technical' | 'Non-Technical' | 'Signature'>('Technical');
  const techScrollRef = useRef<HTMLDivElement | null>(null);
  const nonTechScrollRef = useRef<HTMLDivElement | null>(null);
  const signatureScrollRef = useRef<HTMLDivElement | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{ title: string; subtitle: string; tag: string; description: string } | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const [passes, setPasses] = useState<any[]>([]);
  const [isPassesLoading, setIsPassesLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success');
  const toastTimeoutRef = useRef<number | null>(null);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    const handleLoad = () => window.scrollTo(0, 0);
    window.addEventListener('load', handleLoad);

    return () => window.removeEventListener('load', handleLoad);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/events`);
        const data = await response.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load events for homepage:', error);
      } finally {
        setIsEventsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchPasses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/passes`);
        const data = await response.json();
        setPasses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load passes for homepage:', error);
      } finally {
        setIsPassesLoading(false);
      }
    };

    fetchPasses();
  }, []);

  const categorizedEvents = useMemo(() => {
    const normalized = events.map((event) => ({
      id: event.id,
      title: event.eventName,
      subtitle: event.teamOrIndividual || 'Event',
      tag: event.passName || event.eventCategory || 'Event',
      description: event.eventDescription || 'Details will be announced soon.',
      passName: ((event.passName || '') as string).toLowerCase(),
    }));

    const isTechPass = (name: string) => name.includes('tech pass') && !name.includes('non-tech') && !name.includes('non tech') && !name.includes('nontech');
    const isNonTechPass = (name: string) => name.includes('non-tech') || name.includes('non tech') || name.includes('nontech');

    return {
      Technical: normalized.filter((e) => isTechPass(e.passName)),
      'Non-Technical': normalized.filter((e) => isNonTechPass(e.passName)),
      Signature: normalized.filter((e) => !isTechPass(e.passName) && !isNonTechPass(e.passName)),
    };
  }, [events]);

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

  const handleAddPassToCart = async (passId: number, passName: string) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/pass-cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, passId }),
      });

      if (!response.ok) {
        const err = await response.json();
        console.error(err?.message || 'Failed to add pass to cart.');
        setToastVariant('error');
        setToastMessage(err?.message || 'Could not add to cart');
        if (toastTimeoutRef.current) {
          window.clearTimeout(toastTimeoutRef.current);
        }
        toastTimeoutRef.current = window.setTimeout(() => {
          setToastMessage(null);
          toastTimeoutRef.current = null;
        }, 2600);
        return;
      }

      setToastVariant('success');
      setToastMessage(`${passName} added to cart`);
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
      toastTimeoutRef.current = window.setTimeout(() => {
        setToastMessage(null);
        toastTimeoutRef.current = null;
      }, 2200);
    } catch (error) {
      console.error('Failed to add pass to cart:', error);
      setToastVariant('error');
      setToastMessage('Network error while adding to cart');
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
      toastTimeoutRef.current = window.setTimeout(() => {
        setToastMessage(null);
        toastTimeoutRef.current = null;
      }, 2600);
    }
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

        {toastMessage && (
          <div
            className={`fixed top-24 right-6 z-50 px-4 py-2 rounded-lg shadow-lg text-sm backdrop-blur-md border ${
              toastVariant === 'success'
                ? 'bg-black/85 border-gold-500/40 text-gold-200'
                : 'bg-black/85 border-red-500/50 text-red-200'
            }`}
            role="status"
            aria-live="polite"
          >
            {toastMessage}
          </div>
        )}

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
                <h2 className="text-3xl font-bold font-display text-center mb-8 text-gold-gradient">Discover the Battlefields</h2>
                <p className="text-center text-gray-300 mb-8">Choose your arena and explore the events crafted for every kind of challenger.</p>

                <div className="flex flex-wrap justify-center gap-4 mb-10">
                  {['Technical', 'Non-Technical', 'Signature'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveEventTab(tab)}
                      className={`px-5 py-2 rounded-full text-lg font-bold font-semibold transition-all ${
                        activeEventTab === tab ? 'bg-samhita-600 text-white' : 'gold-outline'
                      }`}
                    >
                      {tab} Events
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-5xl mx-auto">
                  {activeEventTab === 'Technical' && (
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white text-center">Technical Events</h3>
                      <div className="relative">
                        <div ref={techScrollRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar pr-16">
                          {categorizedEvents.Technical.map((event) => (
                            <div
                              key={event.id}
                              className="min-w-[280px] h-[420px] snap-center bg-black/70 backdrop-blur-md border border-gold-500/30 p-6 rounded-lg gold-glow flex flex-col"
                            >
                              <p className="text-xs text-gold-400 mb-2 uppercase tracking-widest">{event.tag}</p>
                              <h4 className="text-xl font-bold text-white mb-1 font-event-heading">{event.title}</h4>
                              <p className="text-gray-400 mb-4 font-event-body">{event.subtitle}</p>
                              <button
                                type="button"
                                onClick={() => { setSelectedEvent(event); setIsEventModalOpen(true); }}
                                className="inline-flex px-4 py-2 rounded-lg text-xs font-semibold gold-outline hover:scale-105 transition-transform mt-auto"
                              >
                                View Details
                              </button>
                            </div>
                          ))}
                          {categorizedEvents.Technical.length === 0 && !isEventsLoading && (
                            <div className="text-gray-400 text-sm">No technical events added yet.</div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => techScrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 border-samhita-600 text-samhita-600 bg-black/70 hover:bg-samhita-600 hover:text-black transition text-lg font-bold"
                          aria-label="Scroll technical events left"
                        >
                          &lsaquo;
                        </button>
                        <button
                          type="button"
                          onClick={() => techScrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
                          className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 border-samhita-600 text-samhita-600 bg-black/70 hover:bg-samhita-600 hover:text-black transition text-lg font-bold"
                          aria-label="Scroll technical events right"
                        >
                          &rsaquo;
                        </button>
                      </div>
                    </div>
                  )}

                  {activeEventTab === 'Non-Technical' && (
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white text-center">Non-Technical Events</h3>
                      <div className="relative">
                        <div ref={nonTechScrollRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar pr-16">
                          {categorizedEvents['Non-Technical'].map((event) => (
                            <div
                              key={event.id}
                              className="min-w-[280px] h-[420px] snap-center bg-black/70 backdrop-blur-md border border-gold-500/30 p-6 rounded-lg gold-glow flex flex-col"
                            >
                              <p className="text-xs text-gold-400 mb-2 uppercase tracking-widest">{event.tag}</p>
                              <h4 className="text-xl font-bold text-white mb-1 font-event-heading">{event.title}</h4>
                              <p className="text-gray-400 mb-4 font-event-body">{event.subtitle}</p>
                              <button
                                type="button"
                                onClick={() => { setSelectedEvent(event); setIsEventModalOpen(true); }}
                                className="inline-flex px-4 py-2 rounded-lg text-xs font-semibold gold-outline hover:scale-105 transition-transform mt-auto"
                              >
                                View Details
                              </button>
                            </div>
                          ))}
                          {categorizedEvents['Non-Technical'].length === 0 && !isEventsLoading && (
                            <div className="text-gray-400 text-sm">No non-technical events added yet.</div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => nonTechScrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 border-samhita-600 text-samhita-600 bg-black/70 hover:bg-samhita-600 hover:text-black transition text-lg font-bold"
                          aria-label="Scroll non-technical events left"
                        >
                          &lsaquo;
                        </button>
                        <button
                          type="button"
                          onClick={() => nonTechScrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
                          className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 border-samhita-600 text-samhita-600 bg-black/70 hover:bg-samhita-600 hover:text-black transition text-lg font-bold"
                          aria-label="Scroll non-technical events right"
                        >
                          &rsaquo;
                        </button>
                      </div>
                    </div>
                  )}

                  {activeEventTab === 'Signature' && (
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white text-center">Signature Events</h3>
                      <div className="relative">
                        <div ref={signatureScrollRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar pr-16">
                          {categorizedEvents.Signature.map((event) => (
                            <div
                              key={event.id}
                              className="min-w-[280px] h-[420px] snap-center bg-black/70 backdrop-blur-md border border-gold-500/30 p-6 rounded-lg gold-glow flex flex-col"
                            >
                              <p className="text-xs text-gold-400 mb-2 uppercase tracking-widest">{event.tag}</p>
                              <h4 className="text-xl font-bold text-white mb-1 font-event-heading">{event.title}</h4>
                              <p className="text-gray-400 mb-4 font-event-body">{event.subtitle}</p>
                              <button
                                type="button"
                                onClick={() => { setSelectedEvent(event); setIsEventModalOpen(true); }}
                                className="inline-flex px-4 py-2 rounded-lg text-xs font-semibold gold-outline hover:scale-105 transition-transform mt-auto"
                              >
                                View Details
                              </button>
                            </div>
                          ))}
                          {categorizedEvents.Signature.length === 0 && !isEventsLoading && (
                            <div className="text-gray-400 text-sm">No signature events added yet.</div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => signatureScrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 border-samhita-600 text-samhita-600 bg-black/70 hover:bg-samhita-600 hover:text-black transition text-lg font-bold"
                          aria-label="Scroll signature events left"
                        >
                          &lsaquo;
                        </button>
                        <button
                          type="button"
                          onClick={() => signatureScrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
                          className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 border-samhita-600 text-samhita-600 bg-black/70 hover:bg-samhita-600 hover:text-black transition text-lg font-bold"
                          aria-label="Scroll signature events right"
                        >
                          &rsaquo;
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <h2 id="passes" className="text-3xl font-bold font-display text-center mt-16 mb-12 text-gold-gradient scroll-mt-28">Event Passes</h2>
                <div className="max-w-6xl mx-auto">
                  {isPassesLoading ? (
                    <div className="text-center text-gray-400">Loading passes...</div>
                  ) : passes.length === 0 ? (
                    <div className="text-center text-gray-400">No passes available yet.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
                      {passes.map((pass) => (
                        <div
                          key={pass.id}
                          className="bg-black/70 backdrop-blur-md border border-gold-500/30 p-6 rounded-lg transform transition-transform hover:-translate-y-2 gold-glow w-[280px] h-[420px] flex flex-col"
                        >
                          <h3 className="text-xl font-bold text-white mb-2">{pass.name}</h3>
                          <p className="text-2xl font-bold text-gold-400 mb-3">₹{pass.cost}</p>
                          <p className="text-gray-300 mb-4">{pass.description || 'Pass details will be announced soon.'}</p>
                          <button
                            type="button"
                            onClick={() => handleAddPassToCart(pass.id, pass.name)}
                            className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold gold-button hover:scale-105 transition-transform mt-auto"
                          >
                            Add to Cart
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                      What You Gain at SAMHITA'26:
                      <ul className="list-disc list-inside ml-6 text-gray-400">
                        <li>Anna University–affiliated participation certificates</li>
                        <li>Resume-enhancing national-level recognition</li>
                        <li>Cash prizes and rewards for winners</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </section>

            <PassesDisplay />

            <section id="sponsors" className="py-12">
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

        <ThemedModal
            isOpen={isEventModalOpen}
            onClose={() => setIsEventModalOpen(false)}
            title={selectedEvent ? selectedEvent.title : "Event Details"}
        >
            {selectedEvent && (
              <div className="space-y-3">
                <p className="text-gold-400 text-xs uppercase tracking-widest">{selectedEvent.tag}</p>
                <p className="text-gray-300 text-sm font-event-body">{selectedEvent.subtitle}</p>
                <p className="text-gray-200 font-event-body">{selectedEvent.description}</p>
                <div className="pt-2">
                  <a href="#passes" className="inline-flex px-4 py-2 rounded-lg text-xs font-semibold gold-outline hover:scale-105 transition-transform">
                    View Passes
                  </a>
                </div>
              </div>
            )}
        </ThemedModal>

        </main>

        <footer id="contact" className="py-16 px-6 sm:px-12 bg-black/50 backdrop-blur-md border-t border-gold-500/20 text-gray-400">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 max-w-7xl mx-auto text-center md:text-left">
                <div>
                    <h3 className="text-lg font-bold mb-4 text-white">SAMHITA</h3>
                    <p className="text-lg font-bold">Fostering the next generation of technologists through innovation and collaboration.</p>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
                    <ul className="space-y-2 text-lg font-bold">
                        <li><a href="#about" className="hover:text-gold-400 transition">About</a></li>
                        <li><a href="#events" className="hover:text-gold-400 transition">Events</a></li>
                        <li><a href="#passes" className="hover:text-gold-400 transition">Event Passes</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-4 text-white">Contact</h3>
                    <p className="text-lg font-bold">Email: <a href="mailto:itasamhita26@gmail.com" className="hover:text-gold-400 transition">itasamhita26@gmail.com</a></p>
                    <p className='text-lg font-bold'>Phone: <a href="tel:+91 8903402688" className="hover:text-gold-400 transition">+91 89034 02688</a></p>
                    <p className="text-lg font-bold">Address: MIT Campus, Chromepet, Chennai</p>
                </div>
            </div>
            <p className="text-xs text-center border-t border-gold-500/20 pt-8 mt-8">© {new Date().getFullYear()} SAMHITA - Nation Level Technical Symposium. All Rights Reserved.</p>
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





