import Link from "next/link";
import Seal from "@/components/Seal";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const orderId = params.orderId;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="flex justify-center mb-6">
        <div className="rounded-full bg-green-100 p-4">
          <Seal size={64} className="text-green-600" />
        </div>
      </div>
      <h1 className="font-display text-4xl font-bold text-ink mb-4">
        Order Confirmed!
      </h1>
      <p className="text-ink/70 text-lg mb-2">
        Thank you for your order. We&apos;re preparing it now!
      </p>
      {orderId && (
        <p className="text-ink/50 text-sm mb-8">
          Order ID: <span className="font-mono font-medium text-ink">{orderId}</span>
        </p>
      )}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          href="/menu"
          className="rounded-full bg-maroon px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-maroon-dark focus-ring"
        >
          Order More
        </Link>
        <Link
          href="/"
          className="rounded-full border border-gold/40 px-8 py-3 text-base font-semibold text-ink/60 transition-colors hover:bg-maroon/5 focus-ring"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
