import { UnderlineLink } from "@/components/effects/underline/underline-link";
import { Grid } from "@/components/ui/grid";

export function AboutArcabucoSection() {
  return (
    <section className="bg-secondary-50">
      <Grid className="py-16 lg:py-32 items-center bg-secondary-50">
        <h2 className="col-span-12 md:col-span-8 lg:col-start-3 lg:col-end-10 font-serif text-balance italic text-secondary-300 text-3xl lg:text-4xl">
          Design as Cultural Expression Through Craft and Material
        </h2>
        <div className="col-span-12 md:col-start-9 md:col-end-17 lg:col-start-13 lg:col-end-22 flex flex-col gap-6">
          <div className="flex flex-col gap-4 font-serif text-secondary-600 text-xl">
            <p className="indent-16">
              Rooted in architecture and interior design, Arcabuco curates objects conceived as functional works of art—pieces that carry cultural depth, material integrity, and a contemporary design vision.
            </p>
            <p>
              We collaborate with skilled workshops, independent makers, and design-driven manufacturers to bring thoughtful objects to life—ranging from limited handcrafted editions to carefully produced pieces that can be lived with and collected over time.
            </p>
          </div>
          <UnderlineLink
            href="/about"
            className="leading-none font-sans text-lg font-medium uppercase tracking-wider text-secondary-300"
          >
            Discover
          </UnderlineLink>
        </div>
      </Grid>
    </section>
  );
}
