import type { Metadata } from "next";
import { Space_Grotesk, Noto_Sans_Oriya } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap"
});

const notoOriya = Noto_Sans_Oriya({
  subsets: ["latin"],
  variable: "--font-odia",
  weight: ["400", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Asta Prahari | The 8 Temporal Realms",
  description: "The living digital mandala of the 24-hour chant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${notoOriya.variable}`}>
      <body className="bg-void text-white overflow-x-hidden antialiased">
        {children}
      </body>
    </html>
  );
}