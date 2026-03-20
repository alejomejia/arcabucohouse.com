import type { Metadata } from "next";

import { AboutArcabucoSection } from "./_components/about-arcabuco";
import { ArtisansCollabSection } from "./_components/artisans-collab";
import { HeroSection } from "./_components/hero";
import { InteriorShowcaseSection } from "./_components/interior-showcase";

// TODO: Replace with a compelling, keyword-rich description of the store
// Focus on: what you sell, who it's for, and the key differentiator (handcrafted, Latin American artisans)
export const metadata: Metadata = {
  description:
    'Discover handcrafted home décor and artisan goods from Latin America. Curated rugs, lighting, furniture, and decorative objects made by skilled Latin American artisans. Shop Arcabuco House.',
  openGraph: {
    type: 'website',
    // TODO: Add a high-quality OG image (1200×630px) for social sharing
    // images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Arcabuco House' }],
  },
  twitter: {
    card: 'summary_large_image',
    // TODO: Add @twitterhandle once confirmed
    // site: '@arcabucohouse',
  },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutArcabucoSection />
      <InteriorShowcaseSection />
      <ArtisansCollabSection />
      {/* @TODO: [X] Projects section */}
      {/* @TODO: Why Arcabuco section */}
      {/* @TODO: LatinAmerican Design section */}
    </>
  )
}
