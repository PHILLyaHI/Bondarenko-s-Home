import { notFound } from "next/navigation";
import { isVariantSlug, variants } from "../variants";
import VariantBootstrap from "../variant-bootstrap";
import Nav from "@/app/components/nav";
import Hero from "@/app/components/hero";
import TrustStrip from "@/app/components/trust-strip";
import Photographer from "@/app/components/photographer";
import Gallery from "@/app/components/gallery";
import TwilightFeature from "@/app/components/twilight-feature";
import Services from "@/app/components/services";
import Process from "@/app/components/process";
import Pricing from "@/app/components/pricing";
import Testimonials from "@/app/components/testimonials";
import Coverage from "@/app/components/coverage";
import Booking from "@/app/components/booking";
import Footer from "@/app/components/footer";

interface Params {
  variant: string;
}

export function generateStaticParams() {
  return variants.map((v) => ({ variant: v.slug }));
}

export default async function VariantPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { variant } = await params;
  if (!isVariantSlug(variant)) notFound();

  return (
    <>
      <VariantBootstrap scale={variant} />
      <Nav />
      <main className="pb-32 md:pb-0">
        <Hero />
        <TrustStrip />
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
