import Nav from "./components/nav";
import Hero from "./components/hero";
import TrustStrip from "./components/trust-strip";
import Photographer from "./components/photographer";
import Gallery from "./components/gallery";
import TwilightFeature from "./components/twilight-feature";
import Services from "./components/services";
import Process from "./components/process";
import Pricing from "./components/pricing";
import Testimonials from "./components/testimonials";
import Coverage from "./components/coverage";
import Booking from "./components/booking";
import Footer from "./components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="pb-32 md:pb-0">
        <Hero />
        <TrustStrip />
        {/* Photographer replaces the old "Buyers scroll" Manifesto on both viewports. */}
        <Photographer />
        <Gallery />
        <TwilightFeature />
        <Services />
        <Process />
        <Pricing />
        <Testimonials />
        <Coverage />
        <Booking />
      </main>
      <Footer />
    </>
  );
}
