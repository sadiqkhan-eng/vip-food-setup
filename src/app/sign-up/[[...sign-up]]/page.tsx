import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-ink mb-2">
            Create Your Account
          </h1>
          <p className="text-ink/60 text-sm">
            Join VIP Setup to track orders, make reservations, and earn rewards.
          </p>
        </div>
        <div className="flex justify-center">
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            fallbackRedirectUrl="/account"
          />
        </div>
        <p className="text-center text-xs text-ink/40 mt-6">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-maroon font-semibold hover:text-maroon-dark">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
