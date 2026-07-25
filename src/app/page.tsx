import Link from "next/link";
import Seal from "@/components/Seal";
import VideoSection from "@/components/VideoSection";
import {
  BiryaniIcon,
  KarahiIcon,
  NihariIcon,
  KebabIcon,
  PizzaIcon,
  BurgerIcon,
  ChickenIcon,
  LassiIcon,
  StarIcon,
  ClockIcon,
  TruckIcon,
  ShieldIcon,
  UtensilsIcon,
  FireIcon,
  LeafIcon,
} from "@/components/Icons";

function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be)/.test(
    url ?? ""
  );
}

function isVimeoUrl(url: string): boolean {
  return /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)/.test(url ?? "");
}

function getYouTubeEmbedUrl(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

function getVimeoEmbedUrl(url: string): string {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? `https://player.vimeo.com/video/${match[1]}` : url;
}
const signatureDishes = [
  {
    name: "Chicken Biryani",
    tagline: "The Crown Jewel",
    description:
      "Every grain of basmati infused with saffron, layered over slow-cooked chicken marinated for 12 hours in royal spices. This is not just food — it is an heirloom recipe passed down through generations.",
    price: "Rs. 650",
    badge: "#1 Seller",
    icon: BiryaniIcon,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80",
    tags: [{ label: "Spicy", icon: FireIcon }],
  },
  {
    name: "Mutton Nihari",
    tagline: "The Slow Obsession",
    description:
      "Mutton braised for 8 hours until it falls apart at the touch of a spoon. A gravy so deep and rich, it took us 3 years to perfect. Served with fluffy naan and a squeeze of lime.",
    price: "Rs. 900",
    badge: "Chef's Pick",
    icon: NihariIcon,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80",
    tags: [{ label: "Slow Cooked", icon: ClockIcon }],
  },
  {
    name: "Chicken Karahi",
    tagline: "Bold & Fiery",
    description:
      "Wok-fired to order with fresh tomatoes, green chilies, and ginger — this karahi hits every note. Smoky, spicy, and unapologetically Pakistani.",
    price: "Rs. 750",
    badge: "Spicy",
    icon: KarahiIcon,
    image: "https://images.unsplash.com/photo-1631515243349-e6cb73fb94e4?w=600&q=80",
    tags: [
      { label: "Spicy", icon: FireIcon },
      { label: "Fresh", icon: LeafIcon },
    ],
  },
  {
    name: "Seekh Kebab Platter",
    tagline: "Charred to Perfection",
    description:
      "Hand-minced lamb, seasoned with just the right amount of heat, grilled over open charcoal until the edges crisp. Six kebabs, one unforgettable plate.",
    price: "Rs. 550",
    badge: "Fan Favorite",
    icon: KebabIcon,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80",
    tags: [{ label: "Charcoal Grilled", icon: FireIcon }],
  },
];

const fastFoodItems = [
  {
    name: "Chicken Tikka Pizza",
    desc: "Our signature twist — smoky tikka chunks on hand-tossed dough with melty mozzarella",
    price: "Rs. 950",
    icon: PizzaIcon,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80",
  },
  {
    name: "Zinger Burger",
    desc: "Crunchy, juicy, and messy in the best way. A whole chicken fillet in every bite",
    price: "Rs. 480",
    icon: BurgerIcon,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
  },
  {
    name: "Fried Chicken Bucket",
    desc: "8 pieces of golden, 24-hour marinated fried chicken. The crunch heard across Karachi",
    price: "Rs. 1,200",
    icon: ChickenIcon,
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&q=80",
  },
  {
    name: "Mango Lassi",
    desc: "Thick, creamy, and dripping with real Alphonso mango. The only way to cool down",
    price: "Rs. 200",
    icon: LassiIcon,
    image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=500&q=80",
  },
];

const stats = [
  { value: "10,000+", label: "Orders Delivered", icon: TruckIcon },
  { value: "4.8", label: "Customer Rating", icon: StarIcon },
  { value: "30 min", label: "Avg. Delivery", icon: ClockIcon },
  { value: "100%", label: "Halal & Fresh", icon: ShieldIcon },
];

export default function HomePage() {
  return (
    <div>
       {/* Hero */}
       <section className="relative overflow-hidden bg-maroon text-white min-h-[85vh] flex items-center">
         <div className="absolute inset-0">
           {(() => {
             const bg = process.env.NEXT_PUBLIC_VIDEO_BACKGROUND;
             const isYt = isYouTubeUrl(bg ?? "");
             const isVm = isVimeoUrl(bg ?? "");
             if (bg && (isYt || isVm)) {
               const embed = isYt
                 ? getYouTubeEmbedUrl(bg)
                 : getVimeoEmbedUrl(bg);
               return (
                 <iframe
                   src={embed}
                   className="absolute inset-0 w-full h-full opacity-40"
                   allowFullScreen
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   title="VIP Setup Hero Video"
                 />
               );
             }
             return bg ? (
               <video
                 autoPlay
                 loop
                 muted
                 playsInline
                 className="absolute inset-0 w-full h-full object-cover opacity-40"
                 preload="auto"
                 crossOrigin="anonymous"
                 src={bg}
               />
             ) : (
               <video
                 autoPlay
                 loop
                 muted
                 playsInline
                 className="absolute inset-0 w-full h-full object-cover opacity-40"
                 preload="auto"
               >
                 <source src="/video/hero-section.mp4" type="video/mp4" />
               </video>
             );
           })()}
           <div className="absolute inset-0 bg-gradient-to-r from-maroon/70 via-maroon/50 to-maroon/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <Seal size={80} className="text-gold mb-8" />
            <p className="text-gold-light text-sm font-semibold uppercase tracking-[0.3em] mb-5">
              Authentic Pakistani & Fast Food
            </p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.05]">
              Taste the{" "}
              <span className="text-gold italic">Legacy</span>
            </h1>
            <p className="text-white/75 text-lg md:text-xl leading-relaxed mb-4 max-w-xl">
              Where centuries-old Pakistani recipes meet modern cravings.
              Biryani that tells a story. Nihari worth the wait. Kebabs that
              demand a second plate.
            </p>
            <p className="text-gold/80 text-sm mb-10 font-medium">
              Biryani &bull; Karahi &bull; Nihari &bull; Kebabs &bull; Pizza &bull; Burgers &bull; Fried Chicken
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/menu"
                className="rounded-full bg-gold px-10 py-4 text-base font-bold text-maroon transition-all hover:bg-gold-light hover:scale-105 focus-ring inline-flex items-center gap-2"
              >
                <UtensilsIcon className="w-5 h-5" />
                Order Now
              </Link>
              <Link
                href="/reserve"
                className="rounded-full border-2 border-gold/60 px-10 py-4 text-base font-semibold text-gold transition-all hover:bg-gold/10 focus-ring inline-flex items-center gap-2"
              >
                Reserve a Table
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-cream to-transparent" />
      </section>

      {/* Stats Bar */}
      <section className="bg-parchment border-y border-gold/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-maroon/10 text-maroon shrink-0">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-display text-xl md:text-2xl font-bold text-maroon leading-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs text-ink/60">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Dishes */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <p className="text-gold-dark text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            Our Signature Dishes
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4">
            Recipes Worth Repeating
          </h2>
          <p className="max-w-2xl mx-auto text-ink/60 text-lg">
            Every dish on this table has a story. These are the ones our guests
            cannot stop talking about.
          </p>
        </div>

        <div className="space-y-8">
          {signatureDishes.map((dish, index) => (
            <div
              key={dish.name}
              className="group relative rounded-3xl bg-parchment border border-gold/20 overflow-hidden transition-all hover:shadow-xl hover:border-gold/40"
            >
              <div className={`flex flex-col lg:flex-row ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                {/* Image */}
                <div className="relative lg:w-2/5 h-64 lg:h-auto min-h-[280px]">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-maroon px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                      {dish.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-maroon shadow-lg">
                    <dish.icon className="w-6 h-6" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center">
                  <p className="font-display text-sm text-gold-dark italic mb-1">
                    {dish.tagline}
                  </p>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-ink mb-3">
                    {dish.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    {dish.tags.map((tag) => (
                      <span
                        key={tag.label}
                        className="inline-flex items-center gap-1 rounded-full bg-maroon/10 px-3 py-1 text-xs font-medium text-maroon"
                      >
                        <tag.icon className="w-3 h-3" />
                        {tag.label}
                      </span>
                    ))}
                  </div>
                  <p className="text-ink/60 leading-relaxed mb-6">
                    {dish.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="font-display text-2xl font-bold text-maroon">
                      {dish.price}
                    </p>
                    <Link
                      href="/menu"
                      className="rounded-full bg-maroon px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-maroon-dark hover:scale-105 focus-ring"
                    >
                      Add to Cart
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Section */}
      <VideoSection />

      {/* Promo Banner */}
      <section className="relative overflow-hidden bg-maroon text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,_rgba(201,153,46,0.2)_0%,_transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <p className="text-gold-light text-sm font-semibold uppercase tracking-widest mb-2">
                Limited Time Offer
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-1">
                Free Delivery on Orders Over Rs. 2,000
              </h2>
              <p className="text-white/60 text-sm">
                No code needed. Order online and the delivery fee is on us.
              </p>
            </div>
            <Link
              href="/menu"
              className="shrink-0 rounded-full bg-gold px-8 py-3.5 text-base font-bold text-maroon transition-all hover:bg-gold-light hover:scale-105 focus-ring"
            >
              Claim Offer
            </Link>
          </div>
        </div>
      </section>

      {/* Fast Food Gallery */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <p className="text-gold-dark text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            Beyond Desi
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4">
            When Cravings Hit Different
          </h2>
          <p className="max-w-2xl mx-auto text-ink/60 text-lg">
            Pakistani soul food is our heart, but comfort food is our language.
            Pizza, burgers, fried chicken — done the VIP way.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {fastFoodItems.map((item) => (
            <div
              key={item.name}
              className="group rounded-3xl bg-parchment border border-gold/20 overflow-hidden transition-all hover:shadow-xl hover:border-gold/40 hover:-translate-y-1"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-maroon shadow-md">
                  <item.icon className="w-5 h-5" />
                </div>
                <p className="absolute bottom-3 right-3 font-display text-lg font-bold text-white drop-shadow-lg">
                  {item.price}
                </p>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-bold text-ink mb-1.5">
                  {item.name}
                </h3>
                <p className="text-ink/60 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-gold/30 bg-parchment">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <p className="text-gold-dark text-sm font-semibold uppercase tracking-[0.2em] mb-3">
              How It Works
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4">
              From Kitchen to Your Door
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                title: "Browse & Pick",
                desc: "Explore our full menu — desi classics or fast food favorites. Add whatever makes you hungry.",
                icon: UtensilsIcon,
              },
              {
                step: "02",
                title: "Place Your Order",
                desc: "Checkout in seconds. Pay online with card or choose cash on delivery — your call.",
                icon: ShieldIcon,
              },
              {
                step: "03",
                title: "Enjoy Hot & Fresh",
                desc: "We prepare your food with care and deliver it piping hot. Or pick it up, ready when you are.",
                icon: TruckIcon,
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-maroon text-gold">
                  <item.icon className="w-7 h-7" />
                </div>
                <p className="text-gold-dark text-xs font-bold uppercase tracking-widest mb-2">
                  Step {item.step}
                </p>
                <h3 className="font-display text-xl font-bold text-ink mb-2">
                  {item.title}
                </h3>
                <p className="text-ink/60 text-sm leading-relaxed max-w-xs mx-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <p className="text-gold-dark text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            What People Say
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink">
            Our Guests Speak
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote:
                "The biryani is the real deal — reminds me of my Ammi's kitchen. I've ordered 5 times this month alone.",
              name: "Ahmed K.",
              detail: "Regular since 2024",
            },
            {
              quote:
                "Best nihari in Karachi, hands down. The meat literally melts. My whole family fights over the last spoonful.",
              name: "Fatima R.",
              detail: "Family orders every Friday",
            },
            {
              quote:
                "Ordered the fried chicken bucket for a party. Gone in 20 minutes. Already planning the next order.",
              name: "Usman T.",
              detail: "Office party hero",
            },
          ].map((review) => (
            <div
              key={review.name}
              className="rounded-3xl bg-parchment border border-gold/20 p-7"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-gold" />
                ))}
              </div>
              <p className="text-ink/80 text-sm leading-relaxed mb-5 italic">
                &ldquo;{review.quote}&rdquo;
              </p>
              <div>
                <p className="font-display font-bold text-ink text-sm">
                  {review.name}
                </p>
                <p className="text-ink/50 text-xs">{review.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-maroon text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-maroon via-maroon/80 to-maroon/60" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
          <Seal size={64} className="text-gold mx-auto mb-6" />
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Hungry Yet?
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-lg mx-auto">
            Your next favorite meal is one click away. Order now and taste why
            thousands keep coming back.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/menu"
              className="rounded-full bg-gold px-10 py-4 text-base font-bold text-maroon transition-all hover:bg-gold-light hover:scale-105 focus-ring inline-flex items-center gap-2"
            >
              <UtensilsIcon className="w-5 h-5" />
              Order Now
            </Link>
            <Link
              href="/book-table"
              className="rounded-full border-2 border-gold/60 px-10 py-4 text-base font-semibold text-gold transition-all hover:bg-gold/10 focus-ring"
            >
              Book a Table
            </Link>
          </div>
        </div>
      </section>

      {/* VIP Membership */}
      <section className="bg-ink text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold-light text-sm font-semibold uppercase tracking-[0.2em] mb-3">
              Exclusive Rewards
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              VIP <span className="text-gold italic">Membership</span>
            </h2>
            <p className="text-white/60 text-lg mt-4 max-w-2xl mx-auto">
              Join the VIP Setup loyalty program and earn points with every order. 
              Unlock exclusive perks as you level up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { tier: "Bronze", points: "0", color: "#CD7F32", perks: "1x points, Free delivery over Rs. 2,000" },
              { tier: "Silver", points: "1,000", color: "#C0C0C0", perks: "1.5x points, Free delivery, 5% off" },
              { tier: "Gold", points: "2,500", color: "#C9992E", perks: "2x points, 10% off, Priority support" },
              { tier: "Platinum", points: "5,000", color: "#E5E4E2", perks: "3x points, 15% off, VIP lounge" },
            ].map((item) => (
              <div
                key={item.tier}
                className="rounded-2xl p-6 border transition-all hover:scale-105 hover:shadow-xl"
                style={{ borderColor: `${item.color}40`, background: `linear-gradient(135deg, ${item.color}15, ${item.color}05)` }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4"
                  style={{ backgroundColor: item.color }}
                >
                  {item.tier[0]}
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-1">
                  {item.tier}
                </h3>
                <p className="text-gold text-sm font-semibold mb-3">
                  {item.points}+ points
                </p>
                <p className="text-white/60 text-sm">
                  {item.perks}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/sign-up"
              className="inline-block rounded-full bg-gold px-8 py-3.5 text-base font-bold text-maroon transition-all hover:bg-gold-light hover:scale-105"
            >
              Join VIP Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}