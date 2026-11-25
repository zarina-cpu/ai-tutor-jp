import { Geist_Mono, Great_Vibes, Marck_Script } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  weight: "400",
  subsets: ["latin"],
});

const marck = Marck_Script({
  variable: "--font-marck",
  weight: "400",
  subsets: ["latin", "cyrillic"],
});

export const metadata = {
  title: "Ироха — AI-репетитор японского",
  description: "Хирагана, катакана, путь N5–N1 и живой репетитор.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${geistMono.variable} ${greatVibes.variable} ${marck.variable} h-full`}
    >
      <body className="min-h-full">
        <ThemeProvider>
          <SiteHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
