import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import ClerkProvider from "@/components/ClerkProvider";

export const metadata: Metadata = {
  title: "VIP Setup | Authentic Pakistani Cuisine",
  description:
    "Royal Pakistani cuisine and fast food — biryani, karahi, nihari, kebabs, pizza, burgers, and fried chicken. Order online or reserve a table.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ClerkProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
