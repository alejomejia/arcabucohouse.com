import type { PropsWithChildren } from "react";

import { Wrapper } from "@/components/layout/wrapper";

export default function MainLayout({ children }: PropsWithChildren) {
  return <Wrapper>{children}</Wrapper>;
}
