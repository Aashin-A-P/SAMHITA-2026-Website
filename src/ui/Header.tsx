import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../Photos/Logo.png";
import { useAuth } from "../context/AuthContext";
import ThemedModal from "../components/ThemedModal";
import { FiLogIn, FiUserPlus, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import API_BASE_URL from "../Config";

interface HeaderProps {
  setIsLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSignUpModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ setIsLoginModalOpen, setIsSignUpModalOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [symposiumStatus, setSymposiumStatus] = useState<any[]>([]);
  const [isSymposiumModalOpen, setIsSymposiumModalOpen] = useState(false);
  const [samhitaDate, setSamhitaDate] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchSymposiumStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/symposium/status`);
        const data = await response.json();
        if (data.success) {
          setSymposiumStatus(data.data);
        } else {
          console.error("Failed to fetch symposium status:", data.message);
        }
      } catch (error) {
        console.error("Error fetching symposium status:", error);
        setModalTitle("Error");
        setModalMessage("Failed to fetch symposium status.");
        setIsModalOpen(true);
      }
    };
    fetchSymposiumStatus();
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate(`/${targetId}`);
    } else {
      const element = document.getElementById(targetId.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleLogout = () => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    logout();
    navigate("/");
  };

  const handleStartSymposium = async (symposiumName: string, date: string) => {
    const displayName = symposiumName === "Carteblanche" ? "SAMHITA" : symposiumName;
    try {
      const response = await fetch(`${API_BASE_URL}/symposium/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symposiumName, startDate: date }),
      });
      if (response && response.ok) {
        setModalTitle("Success");
        setModalMessage(`Successfully started ${displayName}.`);
        setIsModalOpen(true);
        const statusResponse = await fetch(`${API_BASE_URL}/symposium/status`);
        const data = await statusResponse.json();
        if (data.success) {
          setSymposiumStatus(data.data);
        }
      } else {
        setModalTitle("Error");
        setModalMessage(`Failed to start ${displayName}.`);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error(`Error starting ${symposiumName}:`, error);
      setModalTitle("Error");
      setModalMessage(`Error starting ${displayName}.`);
      setIsModalOpen(true);
    }
  };

  const handleStopSymposium = async (symposiumName: string) => {
    const displayName = symposiumName === "Carteblanche" ? "SAMHITA" : symposiumName;
    try {
      const response = await fetch(`${API_BASE_URL}/symposium/stop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symposiumName }),
      });
      if (response && response.ok) {
        setModalTitle("Success");
        setModalMessage(`${displayName} has been stopped.`);
        setIsModalOpen(true);
        const statusResponse = await fetch(`${API_BASE_URL}/symposium/status`);
        const data = await statusResponse.json();
        if (data.success) {
          setSymposiumStatus(data.data);
        }
      } else {
        setModalTitle("Error");
        setModalMessage(`Failed to stop ${displayName}.`);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error(`Error stopping ${symposiumName}:`, error);
      setModalTitle("Error");
      setModalMessage(`Error stopping ${displayName}.`);
      setIsModalOpen(true);
    }
  };

  const getSymposiumStatus = (symposiumName: string) => {
    if (!Array.isArray(symposiumStatus)) return false;
    const symposium = symposiumStatus.find((s) => s.symposiumName === symposiumName);
    return symposium ? symposium.isOpen === 1 : false;
  };

  const samhitaIsOpen = getSymposiumStatus("SAMHITA");

  const navLinks = (
    <>
      {user?.role !== "admin" && (
        <>
          <a href="#home" onClick={(e) => handleNavClick(e, "#home")} className="text-white hover:text-gold-400 transition block py-2 md:py-0">
            Home
          </a>
          <a href="#about" onClick={(e) => handleNavClick(e, "#about")} className="text-white hover:text-gold-400 transition block py-2 md:py-0">
            About
          </a>
          <a href="/gallery" onClick={(e) => { e.preventDefault(); navigate("/gallery"); if (isMobileMenuOpen) setIsMobileMenuOpen(false); }} className="text-white hover:text-gold-400 transition block py-2 md:py-0">
            Gallery
          </a>
        </>
      )}
      {user?.role === "admin" ? (
        <a
          href="/admin"
          onClick={(e) => {
            e.preventDefault();
            navigate("/admin");
            if (isMobileMenuOpen) setIsMobileMenuOpen(false);
          }}
          className="text-white hover:text-gold-400 transition block py-2 md:py-0"
        >
          Managements
        </a>
      ) : (
        <a href="#events" onClick={(e) => handleNavClick(e, "#events")} className="text-white hover:text-gold-400 transition block py-2 md:py-0">
          Events
        </a>
      )}
      <a href="#passes" onClick={(e) => handleNavClick(e, "#passes")} className="text-white hover:text-gold-400 transition block py-2 md:py-0">
        Event Passes
      </a>
      <a href="#contact" onClick={(e) => handleNavClick(e, "#contact")} className="text-white hover:text-gold-400 transition block py-2 md:py-0">
        Contact Us
      </a>
      {user?.role === "admin" && (
        <a
          href="/admin/organizer"
          onClick={(e) => {
            e.preventDefault();
            navigate("/admin/organizer");
            if (isMobileMenuOpen) setIsMobileMenuOpen(false);
          }}
          className="text-white hover:text-gold-400 transition block py-2 md:py-0"
        >
          Organizer
        </a>
      )}
      {user?.role === "admin" && (
        <>
          <button onClick={() => { setIsSymposiumModalOpen(true); if (isMobileMenuOpen) setIsMobileMenuOpen(false); }} className="text-white hover:text-gold-400 transition block py-2 md:py-0 text-left">
            Symposium Control
          </button>
        </>
      )}
      {user && user.role !== "admin" && (
        <a
          href="/enrolled-events"
          onClick={(e) => {
            e.preventDefault();
            navigate("/enrolled-events");
            if (isMobileMenuOpen) setIsMobileMenuOpen(false);
          }}
          className="text-white hover:text-gold-400 transition block py-2 md:py-0"
        >
          My Events
        </a>
      )}
      {user && user.role !== "admin" && (
        <a
          href="/cart"
          onClick={(e) => {
            e.preventDefault();
            navigate("/cart");
            if (isMobileMenuOpen) setIsMobileMenuOpen(false);
          }}
          className="text-white hover:text-gold-400 transition block py-2 md:py-0"
        >
          Cart
        </a>
      )}
      {user && (
        <a
          href="/accommodation"
          onClick={(e) => {
            e.preventDefault();
            navigate("/accommodation");
            if (isMobileMenuOpen) setIsMobileMenuOpen(false);
          }}
          className="text-white hover:text-gold-400 transition block py-2 md:py-0"
        >
          Accommodation
        </a>
      )}
    </>
  );

  const userLabel = user?.role === "admin" ? "Admin" : (user?.name || user?.email || "User");

  return (
    <header className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-gold-500/20 z-30">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo + Title */}
        <div className="flex items-center space-x-3">
          <img src={Logo} alt="SAMHITA Logo" className="h-10 w-auto rounded-md drop-shadow-[0_0_18px_rgba(212,175,55,0.35)]" />
          <span className="text-2xl font-bold font-display text-gold-gradient">
            SAMHITA '26
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks}
        </div>

        {/* Login / Signup / User Info */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <button
                onClick={() => {
                  if (user.role === "admin") {
                    navigate("/admin");
                  } else if (user.role === "organizer") {
                    navigate("/organizer/registrations/view");
                  }
                  if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                }}
                className="px-4 py-2 text-sm rounded-md gold-outline hover:scale-105 transition-transform"
              >
                {user?.id ? (
                  <span>
                    <span className="font-display font-bold text-gold-300 tracking-widest text-base">{user.id}</span> - {userLabel}
                  </span>
                ) : (
                  userLabel
                )}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm rounded-md bg-black/70 border border-gold-500/30 text-gold-100 hover:border-gold-400 transition"
              >
                <FiLogOut className="mr-2" />
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { setIsLoginModalOpen(true); if (isMobileMenuOpen) setIsMobileMenuOpen(false); }}
                className="flex items-center px-4 py-2 text-sm rounded-md gold-button hover:scale-105 transition-transform"
              >
                <FiLogIn className="mr-2" />
                Login
              </button>
              <button
                onClick={() => { setIsSignUpModalOpen(true); if (isMobileMenuOpen) setIsMobileMenuOpen(false); }}
                className="flex items-center px-4 py-2 text-sm rounded-md gold-outline hover:scale-105 transition-transform"
              >
                <FiUserPlus className="mr-2" />
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/90 px-6 pb-4">
          <div className="flex flex-col space-y-4">
            {navLinks}
            <div className="border-t border-gold-500/20 pt-4 flex flex-col space-y-4">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      if (user.role === "admin") {
                        navigate("/admin");
                      } else if (user.role === "student") {
                        navigate("/student-dashboard");
                      } else if (user.role === "organizer") {
                        navigate("/admin/view-registrations");
                      }
                      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 text-sm rounded-md gold-outline hover:scale-105 transition-transform text-left"
                  >
                    {user?.id ? (
                      <span>
                        <span className="font-display font-bold text-gold-300 tracking-widest text-base">{user.id}</span> - {userLabel}
                      </span>
                    ) : (
                      userLabel
                    )}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm rounded-md bg-black/70 border border-gold-500/30 text-gold-100 hover:border-gold-400 transition"
                  >
                    <FiLogOut className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setIsLoginModalOpen(true); if (isMobileMenuOpen) setIsMobileMenuOpen(false); }}
                    className="flex items-center px-4 py-2 text-sm rounded-md gold-button hover:scale-105 transition-transform"
                  >
                    <FiLogIn className="mr-2" />
                    Login
                  </button>
                  <button
                    onClick={() => { setIsSignUpModalOpen(true); if (isMobileMenuOpen) setIsMobileMenuOpen(false); }}
                    className="flex items-center px-4 py-2 text-sm rounded-md gold-outline hover:scale-105 transition-transform"
                  >
                    <FiUserPlus className="mr-2" />
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Symposium Control Modal */}
      <ThemedModal
        isOpen={isSymposiumModalOpen}
        onClose={() => setIsSymposiumModalOpen(false)}
        title="Symposium Control"
        hideDefaultFooter={true}
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white">SAMHITA</h3>
            <p className="text-sm text-gray-300">Status: {samhitaIsOpen ? "Open" : "Closed"}</p>
            {samhitaIsOpen ? (
              <button
                onClick={() => handleStopSymposium("SAMHITA")}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Stop
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  className="bg-gray-700 p-1 rounded-md text-white"
                  value={samhitaDate}
                  onChange={(e) => setSamhitaDate(e.target.value)}
                />
                <button
                  onClick={() => handleStartSymposium("SAMHITA", samhitaDate)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  Start
                </button>
              </div>
            )}
          </div>
        </div>
      </ThemedModal>

      {/* ✅ Global Modal for Alerts */}
      <ThemedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
        <p className="text-white">{modalMessage}</p>
      </ThemedModal>
    </header>
  );
};

export default Header;


