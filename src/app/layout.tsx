import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "./CartContext";  // ✅ Fixed: Ensure uppercase "C"
import { AuthProvider } from "./auth/AuthContext";  // ✅ Fixed: Ensure uppercase "C"
import Header from "./components/header";  // ✅ Fixed: Matches your folder structure
import "./globals.css";  // ✅ Ensuring global styles

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MoonStar Food",
  description: "Explore premium FMCG products and snacks",
  icons: {
    icon: "/products/moonstar-logo.jpg",  // ✅ Ensure this exists in /public/products/
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <Header /> {/* ✅ Unified header */}
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
