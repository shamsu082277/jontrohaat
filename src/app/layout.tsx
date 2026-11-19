import type { Metadata } from "next";
import { manrope, hindSiliguri } from "@/lib/fonts";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "JontroHaat | যন্ত্রহাট – কৃষি যন্ত্রপাতির আধুনিক প্ল্যাটফর্ম",
  description:
    "যন্ত্র ভাড়া নিন, কাজ এগিয়ে নিন। Bangladesh-focused Agricultural Equipment Rental Marketplace.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      suppressHydrationWarning
      className={`${manrope.variable} ${hindSiliguri.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground transition-colors duration-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
