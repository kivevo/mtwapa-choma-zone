import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@/components/seo/google-analytics";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.chomazonemtwapa.co.ke"),
  title: {
    default: "Choma Zone Mtwapa Palms | Best Nyama Choma on the North Coast",
    template: "%s | Choma Zone Mtwapa Palms",
  },
  description:
    "Open Garden Hospitality on the Mombasa-Malindi Highway. Best nyama choma in Mtwapa, garden dining, events, sundowners & family fun. Opposite Galana Petrol Station.",
  keywords: [
    "nyama choma Mtwapa",
    "Choma Zone Mtwapa Palms",
    "restaurant Mtwapa",
    "Mombasa Malindi highway restaurant",
    "events venue Mtwapa",
    "family restaurant North Coast Kenya",
  ],
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: "Choma Zone Mtwapa Palms",
    title: "Choma Zone Mtwapa Palms | Open Garden Hospitality",
    description:
      "Best nyama choma on the North Coast. Garden dining, events & sundowners opposite Galana Petrol Station, Mtwapa.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Choma Zone Mtwapa Palms",
    description: "Open Garden Hospitality — Best nyama choma in Mtwapa",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${fraunces.variable} ${dmSans.variable} font-body antialiased`}
      >
        <GoogleAnalytics gaId={GA_ID} />
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
