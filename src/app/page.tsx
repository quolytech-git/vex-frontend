import React from "react";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import ServicesSection from "@/components/home/ServicesSection";
import IndustriesSection from "@/components/home/IndustriesSection";
import ProcessSection from "@/components/home/ProcessSection";
import CaseStudiesSection from "@/components/home/CaseStudiesSection";
import DifferenceSection from "@/components/home/DifferenceSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PricingSection from "@/components/home/PricingSection";
import FaqSection from "@/components/home/FaqSection";
import InsightsSection from "@/components/home/InsightsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <IndustriesSection />
      <ProcessSection />
      <CaseStudiesSection />
      <DifferenceSection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      <InsightsSection />
    </>
  );
}

