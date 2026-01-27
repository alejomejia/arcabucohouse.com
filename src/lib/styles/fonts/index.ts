import { Manrope } from "next/font/google";
import localFont from 'next/font/local';

export const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  fallback: ["system-ui", "sans-serif"],
});

export const serif = localFont({
  variable: "--font-serif",
  fallback: ["Georgia", "Times New Roman", "serif"],
  src: [
    {
      path: './arc-serif/ArcSerifMTReg.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './arc-serif/ArcSerifMTRegIt.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './arc-serif/ArcSerifMTSmBd.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './arc-serif/ArcSerifMTBold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
})