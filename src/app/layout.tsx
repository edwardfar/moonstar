import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "./CartContext";  // ✅ Ensure uppercase "C"
import { AuthProvider } from "./auth/AuthContext";  // ✅ Ensure uppercase "C"
import Header from "./components/header";  // ✅ Matches your folder structure
import Footer from "./components/footer";  // New: Footer component
import "./globals.css";  // ✅ Global styles

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
            <Header /> {/* Unified header */}
            <main className="min-h-screen pt-20"> {/* Adjust top padding as needed to avoid content hiding under fixed header */}
              {children}
            </main>
            <Footer /> {/* New footer component */}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
