import React, { useState, useEffect } from "react";
import { ArrowRight, Mail, Phone, MapPin, Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Sarah Jenkins",
    role: "Principal, Oakridge International",
    content: "This platform transformed our administrative workflow. What used to take days now takes hours.",
    avatar: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    name: "Mark Thompson",
    role: "IT Director, City High",
    content: "The most intuitive interface I've seen in 15 years of school administration. Highly recommended.",
    avatar: "https://i.pravatar.cc/150?u=mark"
  }
];

function CTA() {
  const [activeTab, setActiveTab] = useState(0);

  // Simple auto-play for carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="contact" className="w-full py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row">
          
          {/* Left Side: Contact Content */}
          <div className="lg:w-1/2 p-8 md:p-16 z-10 bg-white">
            <span className="text-blue-600 font-bold tracking-wider text-sm uppercase mb-4 block">
              Get in Touch
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Ready to modernize <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                your institution?
              </span>
            </h2>
            <p className="text-slate-600 text-lg mb-10 leading-relaxed">
              Join 500+ schools worldwide. Schedule a personalized demo or chat with our education experts today.
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Email us</p>
                  <p className="text-slate-500">support@EduSmart.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Call anytime</p>
                  <p className="text-slate-500">+1 (555) 000-SCHOOL</p>
                </div>
              </div>
            </div>

            <button className="group flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95">
              Contact Sales
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </div>

          {/* Right Side: Testimonial Carousel */}
          <div className="lg:w-1/2 relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-8 md:p-16 flex flex-col justify-center items-center overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full -ml-20 -mb-20 blur-3xl"></div>

            <div className="relative w-full max-w-md">
              <Quote className="text-white/20 absolute -top-10 -left-6" size={80} />
              
              <div className="min-h-[250px] flex flex-col justify-center">
                {testimonials.map((t, index) => (
                  <div 
                    key={index}
                    className={`transition-all duration-700 absolute inset-0 ${
                      index === activeTab ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 pointer-events-none"
                    }`}
                  >
                    <div className="flex gap-1 mb-6 text-yellow-400">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                    <p className="text-xl md:text-2xl text-white font-medium italic mb-8 leading-snug">
                      "{t.content}"
                    </p>
                    <div className="flex items-center gap-4">
                      <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border-2 border-white/30" />
                      <div>
                        <p className="text-white font-bold tracking-wide">{t.name}</p>
                        <p className="text-blue-100 text-sm">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel Indicators */}
              <div className="flex gap-2 mt-12 justify-center lg:justify-start">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeTab ? "w-8 bg-white" : "w-2 bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default CTA;