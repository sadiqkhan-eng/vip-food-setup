"use client";

import { useCart } from "@/hooks/useCart";
import {
  FireIcon,
  LeafIcon,
} from "@/components/Icons";

const foodImages: Record<string, string> = {
  "Chicken Biryani": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
  "Mutton Biryani": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80",
  "Chicken Karahi": "https://images.unsplash.com/photo-1631515243349-e6cb73fb94e4?w=400&q=80",
  "Mutton Nihari": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
  "Seekh Kebab (6 pcs)": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80",
  "Butter Chicken": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
  "Palak Paneer": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&q=80",
  "Dal Makhani": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80",
  "Chicken Tikka Pizza": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  "Classic Cheeseburger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  "Zinger Burger": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80",
  "Fried Chicken (8 pcs)": "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80",
  "Loaded Fries": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
  "Pepperoni Pizza": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80",
  "Mango Lassi": "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&q=80",
  "Salted Lassi": "https://images.unsplash.com/photo-1571934811356-5cc061b6201f?w=400&q=80",
  "Raita": "https://images.unsplash.com/photo-1631898038778-37519e3ee509?w=400&q=80",
  "Naan (2 pcs)": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
};

const fallbackImage = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80";

interface MenuItemCardProps {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isAvailable: boolean;
  isSpicy: boolean;
  isVegetarian: boolean;
}

export default function MenuItemCard({
  id,
  name,
  description,
  price,
  isAvailable,
  isSpicy,
  isVegetarian,
}: MenuItemCardProps) {
  const { addItem, items, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.id === id);
  const quantity = cartItem?.quantity ?? 0;
  const image = foodImages[name] || fallbackImage;

  return (
    <div className="group rounded-2xl bg-parchment border border-gold/20 overflow-hidden transition-all hover:shadow-lg hover:border-gold/40 hover:-translate-y-0.5">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {/* Tags on image */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {isSpicy && (
            <span className="inline-flex items-center gap-1 rounded-full bg-maroon/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-white">
              <FireIcon className="w-3 h-3" />
              Spicy
            </span>
          )}
          {isVegetarian && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-600/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-white">
              <LeafIcon className="w-3 h-3" />
              Veg
            </span>
          )}
          {!isAvailable && (
            <span className="rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-white/80">
              Sold Out
            </span>
          )}
        </div>
        {/* Price on image */}
        <div className="absolute bottom-3 right-3">
          <span className="rounded-full bg-white/95 backdrop-blur-sm px-3 py-1 font-display text-sm font-bold text-maroon shadow-lg">
            Rs. {price.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 className="font-display text-base font-bold text-ink leading-tight">
            {name}
          </h3>
        </div>
        {description && (
          <p className="text-xs text-ink/60 line-clamp-2 mb-3 leading-relaxed">
            {description}
          </p>
        )}

        {/* Add to cart / quantity control */}
        {quantity === 0 ? (
          <button
            onClick={() => addItem({ id, name, price })}
            disabled={!isAvailable}
            className="w-full rounded-full bg-maroon py-2.5 text-sm font-semibold text-white transition-all hover:bg-maroon-dark disabled:opacity-40 disabled:cursor-not-allowed focus-ring"
          >
            {isAvailable ? "Add to Cart" : "Unavailable"}
          </button>
        ) : (
          <div className="flex items-center justify-center gap-1 rounded-full bg-maroon/10 p-1">
            <button
              onClick={() => updateQuantity(id, quantity - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-maroon text-white font-bold text-lg transition-colors hover:bg-maroon-dark focus-ring"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-10 text-center font-display text-base font-bold text-maroon">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(id, quantity + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-maroon text-white font-bold text-lg transition-colors hover:bg-maroon-dark focus-ring"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
