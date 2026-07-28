import Hero from "@/components/home/Hero";
import Trusted from "@/components/home/Trusted";
import Services from "@/components/home/Services";
import NumbersBand from "@/components/home/NumbersBand";
import WhyMatters from "@/components/home/WhyMatters";
import Promise from "@/components/home/Promise";
import Process from "@/components/home/Process";
import Testimonials from "@/components/home/Testimonials";
import PricingTeaser from "@/components/home/PricingTeaser";
import IntakeCTA from "@/components/home/IntakeCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Trusted />      {/* navy */}
      <Services />
      <NumbersBand />  {/* navy */}
      <WhyMatters />
      <Promise />
      <Process />
      <Testimonials />
      <PricingTeaser />
      <IntakeCTA />
    </>
  );
}
