export default function VideoSection() {
  const streetFoodVideo = "/video/our-kitchen-your-plate-section.mp4";
  return (
    <section className="relative bg-ink text-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gold-light text-sm font-semibold uppercase tracking-[0.2em] mb-3">
              Our Kitchen, Your Plate
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-5 leading-tight">
              Crafted with{" "}
              <span className="text-gold italic">Passion</span>,
              <br />
              Served with{" "}
              <span className="text-gold italic">Pride</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-6">
              Every dish at VIP Setup starts with the freshest ingredients and
              follows recipes refined over decades. Watch our chefs transform
              simple ingredients into extraordinary flavors — the way it&apos;s
              been done for generations.
            </p>
            <div className="space-y-3 mb-8">
              {[
                "Hand-ground spice blends, mixed fresh every morning",
                "Tandoor-fired naan baked to order",
                "24-hour marinades for maximum flavor depth",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                  <span className="text-white/70 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <a
              href="/menu"
              className="inline-block rounded-full bg-gold px-8 py-3.5 text-base font-bold text-maroon transition-all hover:bg-gold-light hover:scale-105 focus-ring"
            >
              Explore Full Menu
            </a>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden aspect-video bg-maroon-dark">
              <video
                src={streetFoodVideo}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none rounded-3xl" />
            {/* Decorative corner */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-gold/30 rounded-3xl -z-10" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-2 border-gold/30 rounded-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}