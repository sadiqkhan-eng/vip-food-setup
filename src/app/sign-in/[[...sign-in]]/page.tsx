import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-ink mb-2">
            Welcome Back
          </h1>
          <p className="text-ink/60 text-sm">
            Sign in to access your orders, reservations, and account.
          </p>
        </div>
        <div className="flex justify-center">
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/account"
          />
        </div>
        <p className="text-center text-xs text-ink/40 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-maroon font-semibold hover:text-maroon-dark">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
