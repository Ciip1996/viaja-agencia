import Hero from "@/components/home/Hero";
import HotDeals from "@/components/home/HotDeals";
import FeaturedDestinations from "@/components/home/FeaturedDestinations";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import InstagramFeed from "@/components/home/InstagramFeed";
import Newsletter from "@/components/home/Newsletter";
import FAQ from "@/components/home/FAQ";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HotDeals />
      <FeaturedDestinations />
      <WhyChooseUs />
      <Testimonials />
      <InstagramFeed />
      <Newsletter />
      <FAQ />
    </>
  );
}
