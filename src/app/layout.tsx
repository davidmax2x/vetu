import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, DM_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vêtu — Dressed with intention.",
  description: "AI personal style platform with a persistent AI advisor. Discover your colour season, get outfit recommendations, and try on looks virtually.",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#c9a84c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#C9A84C',
          colorBackground: '#0A0A0B',
          colorText: '#F7F4EF',
          colorTextSecondary: '#7A7D88',
          colorInputBackground: '#1A1A1B',
          colorInputText: '#F7F4EF',
          colorDanger: '#ef4444',
          colorSuccess: '#22c55e',
          borderRadius: '0.75rem',
        },
        elements: {
          card: 'bg-[#0A0A0B] border border-[#E0DBD2]/20',
          headerTitle: 'font-[family-name:var(--font-display)] text-2xl',
          headerSubtitle: 'text-[#7A7D88]',
          formButtonPrimary: 'bg-[#C9A84C] text-[#0A0A0B] hover:bg-[#F0DFA0]',
          socialButtonsBlockButton: 'border-[#E0DBD2]/20 hover:bg-[#1A1A1B]',
          dividerLine: 'bg-[#E0DBD2]/20',
          dividerText: 'text-[#7A7D88]',
          formFieldLabel: 'text-[#F7F4EF]',
          formFieldInput: 'bg-[#1A1A1B] border-[#E0DBD2]/20 text-[#F7F4EF]',
          footerActionLink: 'text-[#C9A84C] hover:text-[#F0DFA0]',
          identityPreviewText: 'text-[#F7F4EF]',
          identityPreviewEditButton: 'text-[#C9A84C]',
        }
      }}
    >
      <html
        lang="en"
        className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-[#0A0A0B] text-[#F7F4EF] font-[family-name:var(--font-body)]">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
