import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";

const publicRoutes = createRouteMatcher([
  "/",
  "/menu",
  "/cart",
  "/checkout",
  "/checkout/success",
  "/book-table",
  "/orders",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

const adminRoutes = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (publicRoutes(req)) {
    return;
  }

  const { userId } = await auth.protect();

  if (adminRoutes(req)) {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata?.role;

    if (role !== "admin") {
      return Response.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
