import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Menu,
  X,
  ChevronDown,
  Users,
  ClipboardList,
  BarChart3,
  CalendarDays,
} from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [featureOpen, setFeatureOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const timeoutRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const features = [
    {
      title: "Student Management",
      desc: "Manage student records easily",
      icon: <Users size={18} />,
    },
    {
      title: "Attendance Tracking",
      desc: "Track daily attendance",
      icon: <ClipboardList size={18} />,
    },
    {
      title: "Analytics Dashboard",
      desc: "Visual reports & insights",
      icon: <BarChart3 size={18} />,
    },
    {
      title: "Class Scheduling",
      desc: "Organize classes efficiently",
      icon: <CalendarDays size={18} />,
    },
  ];

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setFeatureOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setFeatureOpen(false), 200);
  };

  const scrollToSection = (id) => {
    if (location.pathname === "/") {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(`/#${id}`);
    }
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname !== "/") return;
      const sections = ["features", "benefits", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b transition-shadow duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Motion.div
              whileHover={{ scale: 1.05 }}
              className="p-2 bg-blue-600 rounded-lg shadow-md"
            >
              <GraduationCap className="text-white" size={20} />
            </Motion.div>
            <span className="font-bold text-lg">EduSmart</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 relative">
            {/* FEATURES DROPDOWN */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => scrollToSection("features")}
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors"
              >
                Features <ChevronDown size={16} />
              </button>

              <AnimatePresence>
                {featureOpen && (
                  <Motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.2,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="absolute top-10 left-0 w-[26rem] max-w-[90vw] bg-white shadow-xl rounded-2xl p-4 grid grid-cols-2 gap-4 border"
                  >
                    {features.map((item, index) => (
                      <Motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition"
                      >
                        <div className="flex items-center gap-2 mb-1 text-blue-600">
                          {item.icon}
                          <h4 className="font-semibold text-sm">
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </Motion.div>
                    ))}
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other Links */}
            <button
              onClick={() => scrollToSection("how-it-works")}
              className={`hover:text-blue-600 transition-colors ${
                activeSection === "features"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700"
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("benefits")}
              className={`hover:text-blue-600 transition-colors ${
                activeSection === "benefits"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700"
              }`}
            >
              Benefits
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className={`hover:text-blue-600 transition-colors ${
                activeSection === "contact"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700"
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login">
              <Motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Get Started
              </Motion.button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <Motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t"
          >
            <div className="flex flex-col px-6 py-6 gap-5">
              <p className="font-semibold">Features</p>
              {features.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                >
                  {item.icon}
                  {item.title}
                </div>
              ))}
              <button
                onClick={() => scrollToSection("how-it-works")}
                className={`hover:text-blue-600 ${
                  activeSection === "features"
                    ? "text-blue-600 font-semibold"
                    : ""
                }`}
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("benefits")}
                className={`hover:text-blue-600 ${
                  activeSection === "benefits"
                    ? "text-blue-600 font-semibold"
                    : ""
                }`}
              >
                Benefits
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className={`hover:text-blue-600 ${
                  activeSection === "contact"
                    ? "text-blue-600 font-semibold"
                    : ""
                }`}
              >
                Contact
              </button>

              <div>
                <Link to="/login">
                  <Motion.button
                    whileHover={{ scale: 1.05 }}
                    className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Get Started
                  </Motion.button>
                </Link>
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
