import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";

const onest = Onest({
  weight: ["400", "500", "600", "700"],
  subsets: ["cyrillic", "latin"],
  display: "swap",
  variable: "--font-onest",
  fallback: ["Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Калькулятор вышивки детских рисунков",
  description: "Предварительный расчёт стоимости изделия с вышивкой детского рисунка.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${onest.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
