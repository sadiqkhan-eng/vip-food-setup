"use client";

import { useState } from "react";

interface ChefCardProps {
  name: string;
  role: string;
  bio: string | null;
  imageUrl: string | null;
  isAvailable: boolean;
}

const fallbackImages: Record<string, string> = {
  "Chef Ahmed": "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80",
  "Chef Ali": "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80",
  "Chef Muhammad": "https://images.unsplash.com/photo-1583394293214-28ad4a0f1b0a?w=400&q=80",
  "Chef Fatima": "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80",
  "Chef Zain": "https://images.unsplash.com/photo-1603382313337-629a475860ab?w=400&q=80",
  "Chef Sara": "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80",
};

const fallbackImage = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80";

export default function ChefCard({
  name,
  role,
  bio,
  imageUrl,
  isAvailable,
}: ChefCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const image = imageUrl || fallbackImages[name] || fallbackImage;

  return (
    <div className="group rounded-2xl bg-parchment border border-gold/20 overflow-hidden transition-all hover:shadow-lg hover:border-gold/40 hover:-translate-y-0.5">
      <div className="relative h-56 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gold/10 animate-pulse" />
        )}
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-3 right-3">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-600/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-white">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              Available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-600/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-white">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-2v2h-2v-2H7v-2h2V7h2v2h2v2z" />
              </svg>
              Unavailable
            </span>
          )}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-bold text-ink mb-1">
          {name}
        </h3>
        <p className="text-sm text-gold font-semibold mb-3">{role}</p>
        {bio && (
          <p className="text-xs text-ink/60 line-clamp-3 leading-relaxed mb-3">
            {bio}
          </p>
        )}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-maroon/10 text-maroon">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <span className="text-xs text-ink/50">Team Member</span>
        </div>
      </div>
    </div>
  );
}