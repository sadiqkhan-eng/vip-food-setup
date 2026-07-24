import Seal from "./Seal";

export default function Footer() {
  return (
    <footer className="bg-maroon text-white border-t border-gold/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
              <Seal size={40} className="text-gold" />
              <span className="font-display text-2xl font-semibold">
                VIP Setup
              </span>
            </div>
            <p className="text-white/70 text-sm text-center md:text-left">
              Authentic Pakistani cuisine and fast food, served with royal
              hospitality since 2024.
            </p>
          </div>

          <div className="text-center">
            <h3 className="font-display text-lg font-semibold mb-4 text-gold">
              Hours
            </h3>
            <div className="space-y-1 text-sm text-white/80">
              <p>Monday – Thursday: 11 AM – 11 PM</p>
              <p>Friday – Saturday: 11 AM – 12 AM</p>
              <p>Sunday: 12 PM – 10 PM</p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <h3 className="font-display text-lg font-semibold mb-4 text-gold">
              Contact
            </h3>
            <div className="space-y-1 text-sm text-white/80">
              <p>123 Food Street, Karachi</p>
              <p>+92 300 1234567</p>
              <p>info@vipsetup.com</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/20 pt-8 text-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} VIP Setup. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
