import Hero from "@/components/Hero";
import ProblemSolution from "@/components/ProblemSolution";
import Steps from "@/components/Steps";
import ResultsPreview from "@/components/ResultsPreview";
import Features from "@/components/Features";
import LeadMagnetBand from "@/components/LeadMagnetBand";
import HomePricing from "@/components/HomePricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemSolution />
      <Steps />
      <ResultsPreview />
      <Features />
      <LeadMagnetBand />
      <HomePricing />
      <Testimonials />
      <FAQ />
      <CTASection />
    </>
  );
}
