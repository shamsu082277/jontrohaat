import { Manrope, Hind_Siliguri } from "next/font/google";

export const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  variable: "--font-hind-siliguri",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});
