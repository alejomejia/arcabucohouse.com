import { Container } from "@/components/ui/container";
import type { PropsWithChildren } from "react";

export default function LegalLayout({ children }: PropsWithChildren) {
  return (
    <div className="pt-16 pb-48 min-h-dvh font-serif text-primary-base">
      <Container>
        <div className="legal-layout">
          {children}
        </div>
      </Container>
    </div>
  )
}