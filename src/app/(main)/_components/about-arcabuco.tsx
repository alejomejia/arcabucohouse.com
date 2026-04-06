import { UnderlineLink } from "@/components/effects/underline/underline-link";
import { Grid } from "@/components/ui/grid";
import { Text } from "@/components/ui/text";

export function AboutArcabucoSection() {
  return (
    <section className="bg-zinc-200">
      <Grid className="py-16 lg:py-32 items-center">
        <Text preset="h2" className="col-span-12 md:col-span-8 lg:col-start-3 lg:col-end-10 text-balance leading-[1.2]">
          Design as Cultural Expression Through Craft and Material
        </Text>
        <div className="col-span-12 md:col-start-9 md:col-end-17 lg:col-start-13 lg:col-end-22 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <Text preset="body">
              Rooted in architecture and interior design, Arcabuco curates objects conceived as functional works of art—pieces that carry cultural depth, material integrity, and a contemporary design vision.
            </Text>
            <Text preset="body">
              We collaborate with skilled workshops, independent makers, and design-driven manufacturers to bring thoughtful objects to life—ranging from limited handcrafted editions to carefully produced pieces that can be lived with and collected over time.
            </Text>
          </div>
          <UnderlineLink href="/about">
            <Text preset="cta">Discover</Text>
          </UnderlineLink>
        </div>
      </Grid>
    </section>
  );
}
