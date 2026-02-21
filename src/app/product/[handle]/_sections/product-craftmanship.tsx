import { ParallaxImage } from "@/components/effects/parallax";
import { Grid } from "@/components/ui/grid";
import { OVERLAY_IMAGES_SHAPE } from "@/lib/integrations/shopify/config";

export function ProductCraftmanshipSection() {
  return (
    <div className="relative my-20 py-20 border-y border-neutral-200 font-serif text-xl bg-neutral-50">
      <h2 className="flex justify-between items-center text-7xl text-secondary-base italic mb-12">
        <span>
          The Intersection Of
        </span>
        <span>
          Heritage & Design
        </span>
      </h2>
      <Grid>
        <div className="col-span-10 flex flex-col gap-6">
          <p className="indent-[5vw]">At Arcabuco, we treat traditional Colombian craftsmanship as a foundational element of modern architecture. Our process is a deliberate dialogue between the ancient knowledge held by remote artisan communities and a contemporary aesthetic sensibility. This collaboration ensures that every piece is more than an object; it is a synthesis of geography and design.</p>
          <p>The journey of an Arcabuco lamp is one of profound transformation. It begins with the selection of raw, natural fibers, which are handwoven by master artisans into organic forms that carry the weight of their origin. From this starting point, we intervene with technical precision, introducing meticulous embroidery and refined color palettes that shift the vessel from a traditional craft into a modern design icon.</p>
          <p>This evolution results in a unique lighting sculpture characterized by what we call "perfect imperfections." Because each fiber responds uniquely to the tension of the thread and the individuality of the artisan’s gesture, every piece possesses its own distinct DNA. We produce exclusively in small, intentional batches, favoring material integrity over industrial speed—reconsidering light through the lens of tradition.</p>
        </div>
        <div className="col-start-14 -col-end-1">
          <div className="flex items-end gap-4">
            <div className="w-full h-full flex-1/2 aspect-square">
              <ParallaxImage src={OVERLAY_IMAGES_SHAPE.lights} alt="Product Craftmanship" />
            </div>
            <div className="w-full h-full flex-1/2 aspect-9/16">
              <ParallaxImage src={OVERLAY_IMAGES_SHAPE.home} alt=" Product Craftmanship" />
            </div>
          </div>
        </div>
      </Grid>
    </div>
  )
}