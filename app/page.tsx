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

/* Sections alternate light → navy → light … all the way down the page. */
export default function Home() {
  return (
    <>
      <Hero />               {/* light (navy stat card) */}
      <ProblemSolution tone="navy" />
      <Steps />              {/* light */}
      <ResultsPreview tone="navy" />
      <Features />           {/* light */}
      <LeadMagnetBand />     {/* navy */}
      <HomePricing />        {/* light */}
      <Testimonials tone="navy" />
      <FAQ />                {/* light */}
      <CTASection />         {/* navy */}
    </>
  );
}
