import { useEffect } from "react";
import Hero from "../../components/landing/Hero";
import Trusted from "../../components/landing/Trusted"
import Features from "../../components/landing/Features"
import HowItWorks from "../../components/landing/HowItWorks"
import ProductPreview from "../../components/landing/ProductPreview"
import CTA from "../../components/landing/CTA"
import Benefits from "../../components/landing/Benefits"
import Testimonials from "../../components/landing/Testimonials"
import Stats from "../../components/landing/Stats"

function LandingPage() {
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Small delay to ensure elements are rendered
      }
    }
  }, []);

  return (
    <>
      <Hero />
      <Trusted />
      <Features />
      <ProductPreview />
      <Stats />
      <HowItWorks />
      <CTA />
      <Benefits />
      <Testimonials />
    </>
  );
}

export default LandingPage;
