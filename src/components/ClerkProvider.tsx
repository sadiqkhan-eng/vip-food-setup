"use client";

import { ClerkProvider as BaseClerkProvider } from "@clerk/nextjs";

export default function ClerkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BaseClerkProvider
      afterSignOutUrl="/"
      appearance={{
        variables: {
          colorPrimary: "#6E1423",
          colorText: "#241A12",
          borderRadius: "2rem",
          fontFamily: "'Work Sans', sans-serif",
        },
        elements: {
          formButtonPrimary:
            "bg-maroon hover:bg-maroon-dark text-white font-semibold",
          card: "bg-parchment border border-gold/20 shadow-xl",
          headerTitle: "font-display text-2xl font-bold text-ink",
          headerSubtitle: "text-ink/60",
          socialButtonsBlockButton:
            "border-gold/30 text-ink hover:bg-maroon/5",
          formFieldInput:
            "rounded-full border-gold/30 bg-cream focus:ring-gold",
          footerActionLink: "text-maroon hover:text-maroon-dark font-semibold",
        },
      }}
    >
      {children}
    </BaseClerkProvider>
  );
}
