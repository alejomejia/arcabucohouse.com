import type { PropsWithChildren } from "react";

import { Wrapper } from "@/components/layout/wrapper";
import { Container } from "@/components/ui/container";

export default function LegalLayout({ children }: PropsWithChildren) {
  return (
    <Wrapper variant="minimal">
      <div className="pt-16 pb-48 min-h-dvh text-zinc-700">
        <Container>
          <div className="legal-layout">{children}</div>
        </Container>
      </div>
    </Wrapper>
  );
}
