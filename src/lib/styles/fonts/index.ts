import { Manrope } from "next/font/google";

export const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  fallback: ["system-ui", "sans-serif"],
  weight: ["400", "600", "700", "800"]
});
