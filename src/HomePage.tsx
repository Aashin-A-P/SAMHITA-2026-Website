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
import EventCover from './Photos/event_cover.png';
import { FaWhatsapp } from 'react-icons/fa';
import RobertBaratheon from './Photos/Robert Baratheon.png';
import CerseiLannister from './Photos/Cersei Lannister.png';
import TywinLannister from './Photos/Tywin Lannister.png';
import JamieLannister from './Photos/Jamie Lannister.png';
import TyrionLannister from './Photos/Tyrion Lannister.png';
import JoffreyLannister from './Photos/Joffrey Lannister.png';
import TommenLannister from './Photos/Tommen Lannister.png';
import MyrcellaLannister from './Photos/Myrcella Lannister.png';
import NedStark from './Photos/Ned Stark.png';
import CatelynStark from './Photos/Catelyn Stark.png';
import RobbStark from './Photos/Robb Stark.png';
import SansaStark from './Photos/Sansa Stark.png';
import AryaStark from './Photos/Arya Stark.png';
import BranStark from './Photos/Bran Stark.png';
import RickonStark from './Photos/Rickon Stark.png';
import JohnSnow from './Photos/John Snow.png';
import DaenerysTargaryen from './Photos/Daenarys Targaryen.png';
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
  const whatsappLink = 'https://chat.whatsapp.com/CldhOSViVk9EzvmLYAm3H2?mode=gi_t';
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [activeEventTab, setActiveEventTab] = useState<'Technical' | 'Non-Technical' | 'Signature' | 'Workshop'>('Technical');
  const techScrollRef = useRef<HTMLDivElement | null>(null);
  const nonTechScrollRef = useRef<HTMLDivElement | null>(null);
  const signatureScrollRef = useRef<HTMLDivElement | null>(null);
  const workshopScrollRef = useRef<HTMLDivElement | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [selectedPass, setSelectedPass] = useState<any | null>(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [memberCount, setMemberCount] = useState(2);
  const [memberIds, setMemberIds] = useState<string[]>(['', '']);
  const [memberDetails, setMemberDetails] = useState<Record<string, { name: string; email: string }>>({});
  const [teamError, setTeamError] = useState<string | null>(null);
  const memberLookupTimers = useRef<Record<number, number>>({});
  const [events, setEvents] = useState<any[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const [passes, setPasses] = useState<any[]>([]);
  const [isPassesLoading, setIsPassesLoading] = useState(true);
  const [passCartItems, setPassCartItems] = useState<{ id: number; passId: number }[]>([]);
  const [purchasedPassIds, setPurchasedPassIds] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success');
  const toastTimeoutRef = useRef<number | null>(null);
  const [showMitRegisterModal, setShowMitRegisterModal] = useState(false);
  const [eventsInView, setEventsInView] = useState(false);
  const [shouldFlipEvents, setShouldFlipEvents] = useState(false);
  const flipTimerRef = useRef<number | null>(null);
  const eventsSectionRef = useRef<HTMLElement | null>(null);
  const [showTechArrows, setShowTechArrows] = useState(false);
  const [showNonTechArrows, setShowNonTechArrows] = useState(false);
  const [showSignatureArrows, setShowSignatureArrows] = useState(false);
  const [showWorkshopArrows, setShowWorkshopArrows] = useState(false);
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
    const section = eventsSectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEventsInView(entry.isIntersecting);
        if (flipTimerRef.current) {
          window.clearTimeout(flipTimerRef.current);
          flipTimerRef.current = null;
        }
        if (entry.isIntersecting) {
          setShouldFlipEvents(false);
          flipTimerRef.current = window.setTimeout(() => {
            setShouldFlipEvents(true);
            flipTimerRef.current = null;
          }, 750);
        } else {
          setShouldFlipEvents(false);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      if (flipTimerRef.current) {
        window.clearTimeout(flipTimerRef.current);
        flipTimerRef.current = null;
      }
    };
  }, [activeEventTab, events]);


  useEffect(() => {
    const checkOverflow = () => {
      if (techScrollRef.current) {
        setShowTechArrows(techScrollRef.current.scrollWidth > techScrollRef.current.clientWidth);
      }
      if (nonTechScrollRef.current) {
        setShowNonTechArrows(nonTechScrollRef.current.scrollWidth > nonTechScrollRef.current.clientWidth);
      }
      if (signatureScrollRef.current) {
        setShowSignatureArrows(signatureScrollRef.current.scrollWidth > signatureScrollRef.current.clientWidth);
      }
      if (workshopScrollRef.current) {
        setShowWorkshopArrows(workshopScrollRef.current.scrollWidth > workshopScrollRef.current.clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [events, activeEventTab, eventsInView]);

  useEffect(() => {
    setMemberIds((prev) => {
      const next = [...prev];
      while (next.length < memberCount) next.push('');
      return next.slice(0, memberCount);
    });
  }, [memberCount]);

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

  const fetchPassCart = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pass-cart/${userId}`);
      if (!response.ok) {
        setPassCartItems([]);
        return;
      }
      const data = await response.json();
      const items = Array.isArray(data)
        ? data.map((item: any) => ({ id: Number(item.id), passId: Number(item.passId) }))
        : [];
      setPassCartItems(items);
    } catch (error) {
      console.error('Failed to load pass cart:', error);
      setPassCartItems([]);
    }
  };

  const fetchPurchasedPasses = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/registrations/passes/${userId}`);
      if (!response.ok) {
        setPurchasedPassIds([]);
        return;
      }
      const data = await response.json();
      const ids = Array.isArray(data)
        ? data.map((id: any) => Number(id)).filter((id: any) => !Number.isNaN(id))
        : [];
      setPurchasedPassIds(ids);
    } catch (error) {
      console.error('Failed to load purchased passes:', error);
      setPurchasedPassIds([]);
    }
  };

  useEffect(() => {
    if (!user?.id) {
      setPassCartItems([]);
      setPurchasedPassIds([]);
      return;
    }
    fetchPassCart(user.id);
    fetchPurchasedPasses(user.id);
  }, [user]);

  const categorizedEvents = useMemo(() => {
    const normalized = events.map((event) => ({
      ...event,
      title: event.eventName,
      subtitle: event.teamOrIndividual || 'Event',
      tag: event.passName || event.eventCategory || 'Event',
      description: event.eventDescription || 'Details will be announced soon.',
      passName: ((event.passName || '') as string).toLowerCase(),
      category: (event.eventCategory || '') as string,
    }));

    const isTechPass = (name: string) => name.includes('tech pass') && !name.includes('non-tech') && !name.includes('non tech') && !name.includes('nontech');
    const isNonTechPass = (name: string) => name.includes('non-tech') || name.includes('non tech') || name.includes('nontech');
    const isWorkshop = (category: string) => category.toLowerCase().includes('workshop');

    return {
      Technical: normalized.filter((e) => isTechPass(e.passName)),
      'Non-Technical': normalized.filter((e) => isNonTechPass(e.passName)),
      Signature: normalized.filter((e) => !isTechPass(e.passName) && !isNonTechPass(e.passName) && !isWorkshop(e.category)),
      Workshop: normalized.filter((e) => isWorkshop(e.category)),
    };
  }, [events]);

  const getPosterSrc = (posterImage?: string) => {
    if (!posterImage) return null;
    const isPng = posterImage.startsWith('iVBOR');
    const isJpeg = posterImage.startsWith('/9j/');
    const mime = isPng ? 'image/png' : isJpeg ? 'image/jpeg' : 'image/*';
    return `data:${mime};base64,${posterImage}`;
  };

  const getEventsForPass = (pass: any) => {
    if (!pass) return [];
    const name = String(pass.name || '').toLowerCase();
    if (name.includes('global')) {
      return events.filter((e) => {
        const passName = String(e.passName || '').toLowerCase();
        return passName.includes('tech pass') || passName.includes('non-tech') || passName.includes('non tech') || passName.includes('nontech');
      });
    }
    return events.filter((e) => Number(e.passId) === Number(pass.id));
  };

  const techCoverImages = [
    RobertBaratheon,
    CerseiLannister,
    TywinLannister,
    JamieLannister,
    TyrionLannister,
    JoffreyLannister,
    TommenLannister,
    MyrcellaLannister,
  ];
  const nonTechCoverImages = [
    NedStark,
    CatelynStark,
    RobbStark,
    SansaStark,
    AryaStark,
    BranStark,
    RickonStark,
  ];
  const signatureCoverImages = [
    JohnSnow,
    DaenerysTargaryen,
  ];

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

  const isMITStudentHelper = (collegeName?: string) => {
    if (!collegeName) return false;
    const normalized = collegeName.toLowerCase().replace(/[^a-z0-9]/g, '');
    return normalized.includes('madrasinstituteoftechnology') || normalized === 'mit';
  };

  const isHackathonPass = (passName: string) => passName.toLowerCase().includes('hackathon');
  const isPaperPresentationPass = (passName: string) =>
    passName.toLowerCase().includes('paper') && passName.toLowerCase().includes('presentation');
  const isTeamPass = (passName: string) => isHackathonPass(passName) || isPaperPresentationPass(passName);
  const isTechPassName = (passName: string) =>
    passName.toLowerCase().includes('tech pass') &&
    !passName.toLowerCase().includes('non-tech') &&
    !passName.toLowerCase().includes('non tech') &&
    !passName.toLowerCase().includes('nontech');
  const isNonTechPassName = (passName: string) =>
    passName.toLowerCase().includes('non-tech') ||
    passName.toLowerCase().includes('non tech') ||
    passName.toLowerCase().includes('nontech');
  const isGlobalPassName = (passName: string) => passName.toLowerCase().includes('global');
  const isMitEligiblePass = (passName: string) => {
    const name = passName.toLowerCase();
    const isTech = name.includes('tech pass') && !name.includes('non-tech') && !name.includes('non tech') && !name.includes('nontech');
    const isNonTech = name.includes('non-tech') || name.includes('non tech') || name.includes('nontech');
    const isGlobal = name.includes('global');
    return isTech || isNonTech || isGlobal;
  };

  const getTeamConfig = (passName: string) => {
    if (isPaperPresentationPass(passName)) {
      return { min: 2, max: 3, title: 'Paper Presentation Team Details' };
    }
    if (isHackathonPass(passName)) {
      return { min: 2, max: 4, title: 'Hackathon Team Details' };
    }
    return { min: 2, max: 4, title: 'Team Details' };
  };

  const normalizeUserId = (value: string) => {
    const cleaned = value.trim().split(/\s|-/)[0].toUpperCase();
    return cleaned;
  };

  const addPassToCartDirect = async (passId: number, passName: string) => {
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
        if ((err?.message || '').toLowerCase().includes('purchased')) {
          await fetchPurchasedPasses(user.id);
        }
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

      await fetchPassCart(user.id);
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

  const removePassFromCartByPassId = async (passId: number) => {
    if (!user) return;
    const cartItem = passCartItems.find((item) => item.passId === Number(passId));
    if (!cartItem) return;
    await fetch(`${API_BASE_URL}/pass-cart/${cartItem.id}`, { method: 'DELETE' });
  };

  const showToast = (message: string, variant: 'success' | 'error' = 'success') => {
    setToastVariant(variant);
    setToastMessage(message);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimeoutRef.current = null;
    }, 2400);
  };

  const registerMitPass = async (passId: number, passName: string) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/registrations/admin-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, passIds: [passId] }),
      });
      const data = await response.json();
      if (!response.ok) {
        showToast(data?.message || 'Could not register for pass', 'error');
      } else {
        await fetchPurchasedPasses(user.id);
        await fetchPassCart(user.id);
        showToast(`${passName} registered successfully`, 'success');
        setShowMitRegisterModal(true);
      }
    } catch (error) {
      console.error('Failed to register MIT pass:', error);
      showToast('Network error while registering', 'error');
    }
  };

  const deregisterMitPass = async (passId: number) => {
    if (!user) return;
    try {
      await fetch(`${API_BASE_URL}/registrations/admin-deregister`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, passId }),
      });
      await fetchPurchasedPasses(user.id);
    } catch (error) {
      console.error('Failed to deregister pass:', error);
    }
  };

  const handleAddPassToCart = async (passId: number, passName: string) => {
    if (isTeamPass(passName)) {
      const teamConfig = getTeamConfig(passName);
      setSelectedPass({ id: passId, name: passName });
      setTeamName('');
      setMemberCount(teamConfig.min);
      setMemberIds(Array.from({ length: teamConfig.min }, () => ''));
      setMemberDetails({});
      setTeamError(null);
      setIsPassModalOpen(false);
      setIsTeamModalOpen(true);
      return;
    }
    const globalPass = passes.find((p) => isGlobalPassName(p.name));
    const globalPassId = globalPass ? Number(globalPass.id) : null;
    const hasGlobalInCart = globalPassId
      ? passCartItems.some((item) => item.passId === globalPassId)
      : false;
    const techPass = passes.find((p) => isTechPassName(p.name));
    const nonTechPass = passes.find((p) => isNonTechPassName(p.name));
    const techPassId = techPass ? Number(techPass.id) : null;
    const nonTechPassId = nonTechPass ? Number(nonTechPass.id) : null;
    const hasTechInCart = techPassId ? passCartItems.some((i) => i.passId === techPassId) : false;
    const hasNonTechInCart = nonTechPassId ? passCartItems.some((i) => i.passId === nonTechPassId) : false;
    const hasGlobalPurchased = globalPassId
      ? purchasedPassIds.includes(globalPassId)
      : false;
    const hasTechPurchased = techPassId ? purchasedPassIds.includes(techPassId) : false;
    const hasNonTechPurchased = nonTechPassId ? purchasedPassIds.includes(nonTechPassId) : false;

    if (user && isMITStudentHelper(user.college) && isMitEligiblePass(passName)) {
      if (isGlobalPassName(passName)) {
        if (techPassId && hasTechPurchased) await deregisterMitPass(techPassId);
        if (nonTechPassId && hasNonTechPurchased) await deregisterMitPass(nonTechPassId);
        await registerMitPass(passId, passName);
        showToast('Global pass is added', 'success');
        return;
      }
      if (hasGlobalPurchased && (isTechPassName(passName) || isNonTechPassName(passName))) {
        showToast('Global pass is added', 'success');
        return;
      }
      if (isTechPassName(passName) && hasNonTechPurchased && globalPassId) {
        if (nonTechPassId) await deregisterMitPass(nonTechPassId);
        await registerMitPass(globalPassId, globalPass.name);
        showToast('Global pass is added', 'success');
        return;
      }
      if (isNonTechPassName(passName) && hasTechPurchased && globalPassId) {
        if (techPassId) await deregisterMitPass(techPassId);
        await registerMitPass(globalPassId, globalPass.name);
        showToast('Global pass is added', 'success');
        return;
      }
      await registerMitPass(passId, passName);
      return;
    }

    if (isGlobalPassName(passName)) {
      if (techPassId) await removePassFromCartByPassId(techPassId);
      if (nonTechPassId) await removePassFromCartByPassId(nonTechPassId);
      await addPassToCartDirect(passId, passName);
      showToast('Global pass is added', 'success');
      await fetchPassCart(user?.id || '');
      return;
    }

    if (hasGlobalInCart && (isTechPassName(passName) || isNonTechPassName(passName))) {
      showToast('Global pass is added', 'success');
      return;
    }

    if (isTechPassName(passName) && hasNonTechInCart && globalPassId) {
      if (nonTechPassId) await removePassFromCartByPassId(nonTechPassId);
      await addPassToCartDirect(globalPassId, globalPass.name);
      showToast('Global pass is added', 'success');
      await fetchPassCart(user?.id || '');
      return;
    }

    if (isNonTechPassName(passName) && hasTechInCart && globalPassId) {
      if (techPassId) await removePassFromCartByPassId(techPassId);
      await addPassToCartDirect(globalPassId, globalPass.name);
      showToast('Global pass is added', 'success');
      await fetchPassCart(user?.id || '');
      return;
    }

    await addPassToCartDirect(passId, passName);
  };

  const handleMemberIdChange = (index: number, value: string) => {
    const next = [...memberIds];
    next[index] = value;
    setMemberIds(next);
    if (memberLookupTimers.current[index]) {
      window.clearTimeout(memberLookupTimers.current[index]);
    }
    memberLookupTimers.current[index] = window.setTimeout(() => {
      const normalized = normalizeUserId(value);
      if (normalized && normalized.length === 5) {
        fetchMemberName(normalized);
      }
    }, 400);
  };

  const fetchMemberName = async (rawValue: string) => {
    const id = normalizeUserId(rawValue);
    if (!id) return;
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`);
      if (!response.ok) {
        setMemberDetails((prev) => ({ ...prev, [id]: { name: '', email: '' } }));
        return;
      }
      const data = await response.json();
      setMemberDetails((prev) => ({ ...prev, [id]: { name: data.fullName || '', email: data.email || '' } }));
    } catch (error) {
      console.error('Failed to lookup member:', error);
    }
  };

  const submitHackathonTeam = async () => {
    if (!selectedPass || !user?.id) return;
    const teamConfig = getTeamConfig(selectedPass.name || '');
    const cleanedIds = memberIds.map(normalizeUserId).filter(Boolean);
    if (memberCount < teamConfig.min || memberCount > teamConfig.max) {
      setTeamError(`Team must have ${teamConfig.min} to ${teamConfig.max} members.`);
      return;
    }
    if (cleanedIds.length !== memberCount) {
      setTeamError('Please fill all member IDs.');
      return;
    }
    const unique = new Set(cleanedIds);
    if (unique.size !== cleanedIds.length) {
      setTeamError('Duplicate member IDs are not allowed.');
      return;
    }
    if (!teamName.trim()) {
      setTeamError('Please enter a team name.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/pass-teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passId: selectedPass.id,
          teamName: teamName.trim(),
          members: cleanedIds,
          createdBy: user.id,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setTeamError(data.message || 'Failed to save team.');
        return;
      }
      setIsTeamModalOpen(false);
      await addPassToCartDirect(selectedPass.id, selectedPass.name);
    } catch (error) {
      console.error('Failed to create team:', error);
      setTeamError('Failed to save team.');
    }
  };
  const handleRemovePassFromCart = async (cartId: number, passName: string) => {
    if (!user) return;
    try {
      const response = await fetch(`${API_BASE_URL}/pass-cart/${cartId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const err = await response.json();
        setToastVariant('error');
        setToastMessage(err?.message || 'Could not remove from cart');
      } else {
        await fetchPassCart(user.id);
        setToastVariant('success');
        setToastMessage(`${passName} removed from cart`);
      }
    } catch (error) {
      console.error('Failed to remove pass from cart:', error);
      setToastVariant('error');
      setToastMessage('Network error while removing from cart');
    } finally {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
      toastTimeoutRef.current = window.setTimeout(() => {
        setToastMessage(null);
        toastTimeoutRef.current = null;
      }, 2200);
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
              <p className="text-sm sm:text-base tracking-[0.35em] uppercase text-gold-300 mb-2">Information Technology Association</p>
              <p className="text-xs sm:text-sm tracking-[0.6em] uppercase text-gold-200/80 mb-6 font-display italic">Presents</p>
              <img src={CsmitLogo} alt="SAMHITA Logo" className="w-56 md:w-64 h-auto mb-6 drop-shadow-[0_0_35px_rgba(212,175,55,0.45)]" />
              <h1 className="text-4xl md:text-6xl font-bold font-display mb-4 text-gold-gradient">SAMHITA '26</h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl">
                Forging the next generation of technocrats through trials of skill, arenas of competition, and a kingdom where innovation rules.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#about" className="px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-300 gold-button">Explore Realm</a>
                  <a href="#events" className="px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-300 gold-outline">Step Into Battle</a>
              </div>
            </section>

            <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center bg-black/70 backdrop-blur-md border border-gold-500/30 p-8 rounded-lg gold-glow">
                  <h2 className="text-3xl font-bold font-display mb-6 text-gold-gradient">About SAMHITA</h2>
                  <p className="text-lg text-gray-300 mb-8">
                    SAMHITA, the flagship national-level technical symposium organized by the Information Technology Association, stands as a premier platform for innovation, collaboration, and technical excellence. Designed to bring together aspiring technocrats from across institutions, SAMHITA features a diverse array of competitions, workshops, and knowledge-sharing sessions that challenge creativity and problem-solving skills. Over the years, it has evolved into more than just an event - it is a dynamic forum that nurtures talent, encourages industry interaction, and empowers students to transform their ideas into impactful solutions, shaping them into confident and future-ready professionals.
                  </p>

              </div>
            </section>

            
            <section id="events" ref={eventsSectionRef} className="py-20 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold font-display text-center mb-8 text-gold-gradient">Discover the Battlefields</h2>
                <p className="text-center text-gray-300 mb-8">Choose your arena and explore the events crafted for every kind of challenger.</p>

                <div className="flex flex-wrap justify-center gap-4 mb-10">
                  {['Technical', 'Non-Technical', 'Signature', 'Workshop'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveEventTab(tab)}
                      className={`px-5 py-2 rounded-full text-lg font-bold font-semibold transition-all ${
                        activeEventTab === tab ? 'bg-samhita-600 text-white' : 'gold-outline'
                      }`}
                    >
                      {tab === 'Workshop' ? 'Workshops' : `${tab} Events`}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-5xl mx-auto">
                  {activeEventTab === 'Technical' && (
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white text-center">Technical Events</h3>
                      <div className="relative">
                        <div ref={techScrollRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar pr-16">
                          {categorizedEvents.Technical.map((event, index) => {
                            const coverImage = techCoverImages[index] || EventCover;
                            const hasPoster = Boolean(getPosterSrc(event.posterImage));
                            return (
                              <div
                                key={event.id}
                                className="relative min-w-[280px] h-[420px] snap-center bg-black/70 backdrop-blur-md border border-gold-500/30 rounded-lg gold-glow overflow-hidden flex flex-col"
                              >
                                <div className="flip-card w-full h-full">
                                  <div className={`flip-inner${shouldFlipEvents ? ' is-flipped' : ''}`}>
                                    <div className="flip-face">
                                      <img src={coverImage} alt="Event cover" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flip-face flip-back">
                                      {hasPoster ? (
                                        <img
                                          src={getPosterSrc(event.posterImage) as string}
                                          alt={`${event.title} poster`}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                          Poster coming soon
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => { setSelectedEvent(event); setIsEventModalOpen(true); }}
                                  className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex px-4 py-2 rounded-lg text-xs font-semibold gold-outline hover:scale-105 transition-transform"
                                >
                                  View Details
                                </button>
                              </div>
                            );
                          })}
                          {categorizedEvents.Technical.length === 0 && !isEventsLoading && (
                            <div className="text-gray-400 text-sm">No technical events added yet.</div>
                          )}
                        </div>
                        {showTechArrows && (
                          <>
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
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {activeEventTab === 'Non-Technical' && (
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white text-center">Non-Technical Events</h3>
                      <div className="relative">
                        <div ref={nonTechScrollRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar pr-16">
                          {categorizedEvents['Non-Technical'].map((event, index) => {
                            const coverImage = nonTechCoverImages[index] || EventCover;
                            const hasPoster = Boolean(getPosterSrc(event.posterImage));
                            return (
                              <div
                                key={event.id}
                                className="relative min-w-[280px] h-[420px] snap-center bg-black/70 backdrop-blur-md border border-gold-500/30 rounded-lg gold-glow overflow-hidden flex flex-col"
                              >
                                <div className="flip-card w-full h-full">
                                  <div className={`flip-inner${shouldFlipEvents ? ' is-flipped' : ''}`}>
                                    <div className="flip-face">
                                      <img src={coverImage} alt="Event cover" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flip-face flip-back">
                                      {hasPoster ? (
                                        <img
                                          src={getPosterSrc(event.posterImage) as string}
                                          alt={`${event.title} poster`}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                          Poster coming soon
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => { setSelectedEvent(event); setIsEventModalOpen(true); }}
                                  className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex px-4 py-2 rounded-lg text-xs font-semibold gold-outline hover:scale-105 transition-transform"
                                >
                                  View Details
                                </button>
                              </div>
                            );
                          })}
                          {categorizedEvents['Non-Technical'].length === 0 && !isEventsLoading && (
                            <div className="text-gray-400 text-sm">No non-technical events added yet.</div>
                          )}
                        </div>
                        {showNonTechArrows && (
                          <>
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
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {activeEventTab === 'Signature' && (
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white text-center">Signature Events</h3>
                      <div className="relative">
                        <div ref={workshopScrollRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar pr-16">
                          {categorizedEvents.Signature.map((event, index) => {
                            const coverImage = signatureCoverImages[index] || EventCover;
                            const hasPoster = Boolean(getPosterSrc(event.posterImage));
                            return (
                              <div
                                key={event.id}
                                className="relative min-w-[280px] h-[420px] snap-center bg-black/70 backdrop-blur-md border border-gold-500/30 rounded-lg gold-glow overflow-hidden flex flex-col"
                              >
                                <div className="flip-card w-full h-full">
                                  <div className={`flip-inner${shouldFlipEvents ? ' is-flipped' : ''}`}>
                                    <div className="flip-face">
                                      <img src={coverImage} alt="Event cover" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flip-face flip-back">
                                      {hasPoster ? (
                                        <img
                                          src={getPosterSrc(event.posterImage) as string}
                                          alt={`${event.title} poster`}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                          Poster coming soon
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => { setSelectedEvent(event); setIsEventModalOpen(true); }}
                                  className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex px-4 py-2 rounded-lg text-xs font-semibold gold-outline hover:scale-105 transition-transform"
                                >
                                  View Details
                                </button>
                              </div>
                            );
                          })}
                          {categorizedEvents.Signature.length === 0 && !isEventsLoading && (
                            <div className="text-gray-400 text-sm">No signature events added yet.</div>
                          )}
                        </div>
                        {showSignatureArrows && (
                          <>
                            <button
                              type="button"
                          onClick={() => workshopScrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
                              className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 border-samhita-600 text-samhita-600 bg-black/70 hover:bg-samhita-600 hover:text-black transition text-lg font-bold"
                              aria-label="Scroll signature events left"
                            >
                              &lsaquo;
                            </button>
                            <button
                              type="button"
                          onClick={() => workshopScrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
                              className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 border-samhita-600 text-samhita-600 bg-black/70 hover:bg-samhita-600 hover:text-black transition text-lg font-bold"
                              aria-label="Scroll signature events right"
                            >
                              &rsaquo;
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {activeEventTab === 'Workshop' && (
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white text-center">Workshops</h3>
                      <div className="relative">
                        <div ref={signatureScrollRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar pr-16">
                          {categorizedEvents.Workshop.map((event) => {
                            const hasPoster = Boolean(getPosterSrc(event.posterImage));
                            return (
                              <div
                                key={event.id}
                                className="relative min-w-[280px] h-[420px] snap-center bg-black/70 backdrop-blur-md border border-gold-500/30 rounded-lg gold-glow overflow-hidden flex flex-col"
                              >
                                <div className="flip-card w-full h-full">
                                  <div className={`flip-inner${shouldFlipEvents ? ' is-flipped' : ''}`}>
                                    <div className="flip-face">
                                      <img src={EventCover} alt="Event cover" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flip-face flip-back">
                                      {hasPoster ? (
                                        <img
                                          src={getPosterSrc(event.posterImage) as string}
                                          alt={`${event.title} poster`}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                          Poster coming soon
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => { setSelectedEvent(event); setIsEventModalOpen(true); }}
                                  className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex px-4 py-2 rounded-lg text-xs font-semibold gold-outline hover:scale-105 transition-transform"
                                >
                                  View Details
                                </button>
                              </div>
                            );
                          })}
                          {categorizedEvents.Workshop.length === 0 && !isEventsLoading && (
                            <div className="text-gray-400 text-sm">No workshops added yet.</div>
                          )}
                        </div>
                        {showWorkshopArrows && (
                          <>
                            <button
                              type="button"
                              onClick={() => signatureScrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
                              className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 border-samhita-600 text-samhita-600 bg-black/70 hover:bg-samhita-600 hover:text-black transition text-lg font-bold"
                              aria-label="Scroll workshops left"
                            >
                              &lsaquo;
                            </button>
                            <button
                              type="button"
                              onClick={() => signatureScrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
                              className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 border-samhita-600 text-samhita-600 bg-black/70 hover:bg-samhita-600 hover:text-black transition text-lg font-bold"
                              aria-label="Scroll workshops right"
                            >
                              &rsaquo;
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <h2 id="passes" className="text-3xl font-bold font-display text-center mt-16 mb-12 text-gold-gradient scroll-mt-28">Claim Your Pass</h2>
                <div className="max-w-6xl mx-auto">
                  {isPassesLoading ? (
                    <div className="text-center text-gray-400">Loading passes...</div>
                  ) : passes.length === 0 ? (
                    <div className="text-center text-gray-400">No passes available yet.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
                      {passes
                        .filter((pass) => {
                          const isMit = user && isMITStudentHelper(user.college);
                          if (!isMit) return true;
                          return !(isTechPassName(pass.name) || isNonTechPassName(pass.name));
                        })
                        .map((pass) => (
                        <div
                          key={pass.id}
                          className="bg-black/70 backdrop-blur-md border border-gold-500/30 rounded-lg transform transition-transform hover:-translate-y-2 gold-glow w-[280px] h-[480px] flex flex-col overflow-hidden"
                        >
                          <div className="w-full h-[420px]">
                            {pass.posterImage ? (
                              <img
                                src={`data:image/jpeg;base64,${pass.posterImage}`}
                                alt={`${pass.name} poster`}
                                className="w-full h-full object-cover bg-black"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                Poster coming soon
                              </div>
                            )}
                          </div>
                          {(() => {
                            const isPurchased = purchasedPassIds.includes(Number(pass.id));
                            const cartItem = passCartItems.find((item) => item.passId === Number(pass.id));
                            const isMit = user && isMITStudentHelper(user.college);
                            const mitEligible = isMit && isMitEligiblePass(pass.name);
                            const globalPass = passes.find((p) => isGlobalPassName(p.name));
                            const globalPassId = globalPass ? Number(globalPass.id) : null;
                            const hasGlobalInCart = globalPassId
                              ? passCartItems.some((item) => item.passId === globalPassId)
                              : false;
                            const hasGlobalPurchased = globalPassId
                              ? purchasedPassIds.includes(globalPassId)
                              : false;
                            const disableForGlobal =
                              (hasGlobalInCart || hasGlobalPurchased) &&
                              (isTechPassName(pass.name) || isNonTechPassName(pass.name));

                            const renderDetailsButton = (extraClass = '') => (
                              <button
                                type="button"
                                onClick={() => { setSelectedPass(pass); setIsPassModalOpen(true); }}
                                className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold gold-outline hover:scale-105 transition-transform ${extraClass}`}
                              >
                                View Details
                              </button>
                            );

                            if (isPurchased) {
                              return (
                                <div className="mt-auto h-[56px] flex items-stretch gap-3 px-3 pb-3 pt-2">
                                  {renderDetailsButton('flex-1 h-10')}
                                  <button
                                    type="button"
                                    disabled
                                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold bg-gold-500/20 text-gold-200 border border-gold-500/40 cursor-not-allowed flex-1 h-10"
                                  >
                                    Purchased
                                  </button>
                                </div>
                              );
                            }

                            if (cartItem) {
                              return (
                                <div className="mt-auto h-[56px] flex items-stretch gap-3 px-3 pb-3 pt-2">
                                  {renderDetailsButton('flex-1 h-10')}
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePassFromCart(cartItem.id, pass.name)}
                                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold bg-gray-600 text-gray-100 hover:bg-gray-500 transition flex-1 h-10"
                                  >
                                    Remove from Cart
                                  </button>
                                </div>
                              );
                            }

                            if (mitEligible) {
                              return (
                                <div className="mt-auto h-[56px] flex items-stretch gap-3 px-3 pb-3 pt-2">
                                  {renderDetailsButton('flex-1 h-10')}
                                  <button
                                    type="button"
                                    onClick={() => registerMitPass(pass.id, pass.name)}
                                    disabled={disableForGlobal}
                                    className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold flex-1 h-10 ${
                                      disableForGlobal
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        : 'gold-button hover:scale-105 transition-transform'
                                    }`}
                                  >
                                    Register
                                  </button>
                                </div>
                              );
                            }

                            return (
                              <div className="mt-auto h-[56px] flex items-stretch gap-3 px-3 pb-3 pt-2">
                                {renderDetailsButton('flex-1 h-10')}
                                <button
                                  type="button"
                                  onClick={() => handleAddPassToCart(pass.id, pass.name)}
                                  disabled={disableForGlobal}
                                  className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold flex-1 h-10 ${
                                    disableForGlobal
                                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                      : 'gold-button hover:scale-105 transition-transform'
                                  }`}
                                >
                                  Add to Cart
                                </button>
                              </div>
                            );
                          })()}
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

            <HomePageGallery />

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
            hideDefaultFooter
        >
            {selectedEvent && (
              <div className="space-y-3 rounded-lg p-4 bg-black/70 border border-gold-500/30 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                <p className="text-gray-300 font-event-body">{selectedEvent.eventDescription}</p>
                <p className="text-gray-300 text-sm font-event-body">
                  <span className="font-semibold text-gold-200">Pass:</span> {selectedEvent.passName ? selectedEvent.passName : 'N/A'}
                </p>
                <p className="text-gray-300 text-sm font-event-body">
                  <span className="font-semibold text-gold-200">Type:</span> {selectedEvent.teamOrIndividual || 'N/A'}
                </p>
                <p className="text-gray-300 text-sm font-event-body">
                  <span className="font-semibold text-gold-200">Location:</span> {selectedEvent.location || 'N/A'}
                </p>
                <p className="text-gray-300 text-sm font-event-body">
                  <span className="font-semibold text-gold-200">Coordinator:</span> {selectedEvent.coordinatorName || 'N/A'}
                </p>
                <p className="text-gray-300 text-sm font-event-body">
                  <span className="font-semibold text-gold-200">Contact:</span> {selectedEvent.coordinatorContactNo || 'N/A'}
                </p>
                {selectedEvent.rounds && selectedEvent.rounds.length > 0 && (
                  <div className="space-y-2">
                    {selectedEvent.rounds.map((round: any) => (
                      <div key={`round-${round.roundNumber}`} className="text-gray-300 text-sm font-event-body ml-4">
                        <p>Round {round.roundNumber}: {round.roundDetails}</p>
                        <p>Date & Time: {new Date(round.roundDateTime).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
        </ThemedModal>

        <ThemedModal
            isOpen={isPassModalOpen}
            onClose={() => setIsPassModalOpen(false)}
            title={selectedPass ? selectedPass.name : "Pass Details"}
            hideDefaultFooter
        >
            {selectedPass && (
              <div className="space-y-4 rounded-lg p-4 bg-black/70 border border-gold-500/30 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                <p className="text-gray-200 font-event-body">
                  <span className="text-gold-300 font-semibold">Pass Cost:</span> {'\u20B9'}{selectedPass.cost}
                </p>
                <div>
                  <p className="text-gold-300 font-semibold mb-2">Events included in this pass:</p>
                  <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                    {getEventsForPass(selectedPass).length === 0 ? (
                      <li>No events mapped yet.</li>
                    ) : (
                      getEventsForPass(selectedPass).map((evt: any) => (
                        <li key={evt.id}>{evt.eventName}</li>
                      ))
                    )}
                  </ul>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  {(() => {
                    const isPurchased = purchasedPassIds.includes(Number(selectedPass.id));
                    const cartItem = passCartItems.find((item) => item.passId === Number(selectedPass.id));
                    const inCart = Boolean(cartItem);
                    const isMit = user && isMITStudentHelper(user.college);
                    const mitEligible = isMit && isMitEligiblePass(selectedPass.name);
                    const globalPass = passes.find((p) => isGlobalPassName(p.name));
                    const globalPassId = globalPass ? Number(globalPass.id) : null;
                    const hasGlobalInCart = globalPassId
                      ? passCartItems.some((item) => item.passId === globalPassId)
                      : false;
                    const hasGlobalPurchased = globalPassId
                      ? purchasedPassIds.includes(globalPassId)
                      : false;
                    const disableForGlobal =
                      (hasGlobalInCart || hasGlobalPurchased) &&
                      (isTechPassName(selectedPass.name) || isNonTechPassName(selectedPass.name));
                    if (isPurchased) {
                      return (
                        <button
                          type="button"
                          disabled
                          className="px-5 py-2 rounded-lg text-xs font-semibold bg-gold-500/20 text-gold-200 border border-gold-500/40 cursor-not-allowed"
                        >
                          Purchased
                        </button>
                      );
                    }
                    if (mitEligible) {
                      return (
                        <button
                          type="button"
                          onClick={() => registerMitPass(selectedPass.id, selectedPass.name)}
                          disabled={disableForGlobal}
                          className={`px-5 py-2 rounded-lg text-xs font-semibold ${
                            disableForGlobal
                              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                              : 'gold-button hover:scale-105 transition-transform'
                          }`}
                        >
                          Register
                        </button>
                      );
                    }
                    if (inCart && cartItem) {
                      return (
                        <button
                          type="button"
                          onClick={() => handleRemovePassFromCart(cartItem.id, selectedPass.name)}
                          className="px-5 py-2 rounded-lg text-xs font-semibold bg-gray-600 text-gray-200 hover:bg-gray-500 transition-colors"
                        >
                          Remove from Cart
                        </button>
                      );
                    }
                    return (
                      <button
                        type="button"
                        onClick={() => handleAddPassToCart(selectedPass.id, selectedPass.name)}
                        disabled={disableForGlobal}
                        className={`px-5 py-2 rounded-lg text-xs font-semibold ${
                          disableForGlobal
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'gold-button hover:scale-105 transition-transform'
                        }`}
                      >
                        Add to Cart
                      </button>
                    );
                  })()}
                  <button
                    type="button"
                    onClick={() => setIsPassModalOpen(false)}
                    className="px-5 py-2 rounded-lg text-xs font-semibold bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
        </ThemedModal>

        <ThemedModal
            isOpen={isTeamModalOpen}
            onClose={() => setIsTeamModalOpen(false)}
            title={selectedPass ? getTeamConfig(selectedPass.name || '').title : 'Team Details'}
            hideDefaultFooter
        >
            <div className="space-y-4 rounded-lg p-4 bg-black/70 border border-gold-500/30 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <p className="text-sm text-gold-300">
                Note: All team members must be registered on the website.
              </p>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Team Name</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/60 border border-gray-600 text-white"
                  placeholder="Enter team name"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Number of Members ({selectedPass ? `${getTeamConfig(selectedPass.name || '').min}-${getTeamConfig(selectedPass.name || '').max}` : '2-4'})
                </label>
                <select
                  value={memberCount}
                  onChange={(e) => setMemberCount(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/60 border border-gray-600 text-white"
                >
                  {(() => {
                    const cfg = selectedPass ? getTeamConfig(selectedPass.name || '') : { min: 2, max: 4 };
                    const options = [];
                    for (let i = cfg.min; i <= cfg.max; i += 1) {
                      options.push(
                        <option key={i} value={i}>
                          {i}
                        </option>
                      );
                    }
                    return options;
                  })()}
                </select>
              </div>

              <div className="space-y-3">
                {memberIds.map((value, idx) => {
                  const normalized = normalizeUserId(value);
                  const details = normalized ? memberDetails[normalized] : null;
                  return (
                    <div key={`member-${idx}`}>
                      <label className="block text-sm text-gray-300 mb-1">
                        Member {idx + 1} ID
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleMemberIdChange(idx, e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700/60 border border-gray-600 text-white"
                        placeholder="Enter User ID like S0001 (as shown on the website)"
                      />
                      {details?.name && (
                        <p className="text-xs text-green-400 mt-1">
                          {normalized} - {details.name} {details.email ? `(${details.email})` : ''}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {teamError && <p className="text-sm text-red-400">{teamError}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={submitHackathonTeam}
                  className="px-5 py-2 rounded-lg text-xs font-semibold gold-button hover:scale-105 transition-transform"
                >
                  Save Team & Add to Cart
                </button>
              </div>
            </div>
        </ThemedModal>

        <ThemedModal
          isOpen={showMitRegisterModal}
          onClose={() => setShowMitRegisterModal(false)}
          title="Join the SAMHITA WhatsApp Group"
          hideDefaultFooter
        >
          <div className="space-y-4 rounded-lg p-4 bg-black/70 border border-gold-500/30 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <p className="text-gray-300 text-sm">
              You are registered! Please join the official WhatsApp group for updates and announcements.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  window.open(whatsappLink, '_blank');
                  setShowMitRegisterModal(false);
                }}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-gold-500/20 text-gold-200 border border-gold-500/40 hover:bg-gold-500/30 transition"
              >
                Join WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setShowMitRegisterModal(false)}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-gray-600 text-white hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
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
                    <button
                      type="button"
                      onClick={() => window.open(whatsappLink, '_blank')}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-gold-500/20 text-gold-200 border border-gold-500/40 hover:bg-gold-500/30 transition"
                    >
                      <FaWhatsapp /> Join SAMHITA WhatsApp
                    </button>
                </div>
            </div>
            <p className="text-xs text-center border-t border-gold-500/20 pt-8 mt-8">© {new Date().getFullYear()} SAMHITA - National Level Technical Symposium. All Rights Reserved.</p>
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
