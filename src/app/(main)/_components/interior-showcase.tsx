import { ParallaxImage, ParallaxVideo } from "@/components/effects/parallax";
import { Grid } from "@/components/ui/grid";
import { OVERLAY_IMAGES_SHAPE } from "@/lib/integrations/shopify/config";

export function InteriorShowcaseSection() {
  return (
    <Grid as="section" className="py-4">
      <div className="col-span-8 aspect-3/4">
        <ParallaxVideo src="/video-01.mp4" className="object-top" loop />
      </div>
      <div className="col-span-8 aspect-3/4">
        <ParallaxImage src={OVERLAY_IMAGES_SHAPE.home} alt="" />
      </div>
      <div className="col-span-8 aspect-3/4">
        <ParallaxVideo src="/video-02.mp4" className="object-top" loop />
      </div>
    </Grid>
  );
}
