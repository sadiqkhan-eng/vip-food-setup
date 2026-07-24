# VIP Setup — Authentic Pakistani Cuisine & Fast Food

> Royal Pakistani cuisine meets modern cravings. Order biryani, karahi, nihari, kebabs, pizza, burgers, and fried chicken online — or reserve a table in our restaurant.

![VIP Setup](https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80)

---

## ✨ Features

- **Online Food Ordering** — Browse the full menu, customize items, and place delivery or pickup orders.
- **Table Reservations** — Book a table for dine-in with party size selection and special requests.
- **VIP Loyalty Program** — Earn points on every order, unlock Bronze → Silver → Gold → Platinum tiers with exclusive perks.
- **Real-time Order Tracking** — Monitor your order status from pending to delivery.
- **Secure Checkout** — Stripe-powered payments with order summary and delivery fee calculation.
- **Authentication** — Clerk-based sign-in and sign-up for account management and order history.
- **Admin Dashboard** — Manage menu items, orders, reservations, and VIP members.
- **Responsive Design** — Mobile-first, Tailwind CSS-powered UI with custom animations and gradients.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Neon PostgreSQL (serverless) |
| ORM | Drizzle ORM |
| Authentication | Clerk |
| Payments | Stripe |
| Validation | Zod |
| State Management | React Context (CartProvider) |
| Deployment | Vercel |

---

## 📋 Project Structure

```
src/
├── app/                    # Next.js App Router pages & layouts
│   ├── api/               # API routes (orders, reservations, tables, VIP, webhooks)
│   ├── checkout/          # Checkout flow & success page
│   ├── cart/              # Shopping cart page
│   ├── menu/              # Full menu page
│   ├── reserve/           # Table reservation page
│   ├── book-table/        # Book a table page
│   ├── orders/            # Order history page
│   ├── account/           # User account & VIP dashboard
│   ├── admin/             # Admin dashboard
│   ├── sign-in/           # Clerk sign-in pages
│   ├── sign-up/           # Clerk sign-up pages
│   ├── layout.tsx         # Root layout (Header, Footer, Providers)
│   └── page.tsx           # Landing/home page
├── components/            # Reusable UI components
├── db/                    # Drizzle schema, queries, and seed data
├── hooks/                 # Custom React hooks (useCart)
├── lib/                   # Validations (Zod schemas) & utilities
├── types/                 # TypeScript type definitions
└── middleware.ts          # Clerk authentication middleware
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (LTS recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- A [Neon PostgreSQL](https://neon.tech/) database
- A [Clerk](https://clerk.com/) account
- A [Stripe](https://stripe.com/) account (test & live keys)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/vip-setup.git
   cd vip-setup
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up the database**

   ```bash
   npm run db:generate
   npm run db:push
   ```

   (Optional) Seed the database with sample data:

   ```bash
   npm run db:seed
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Setup (.env)

Copy the `.env.local` file and fill in your actual credentials:

```bash
cp .env.local .env.local
```

### Required Variables

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `DATABASE_URL` | Neon PostgreSQL connection string | [Neon Dashboard](https://dashboard.neon.tech) → Project → Connection Details |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | [Clerk Dashboard](https://dashboard.clerk.com) → Your Application → API Keys |
| `CLERK_SECRET_KEY` | Clerk secret key | Clerk Dashboard → API Keys |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in route path | Set to `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up route path | Set to `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Redirect after sign-in | Set to `/account` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Redirect after sign-up | Set to `/account` |
| `STRIPE_SECRET_KEY` | Stripe secret API key | [Stripe Dashboard](https://dashboard.stripe.com) → Developers → API Keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Stripe Dashboard → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Stripe Dashboard → Developers → Webhooks → Your endpoint |
| `NEXT_PUBLIC_APP_URL` | Base URL of your app | `http://localhost:3000` for local dev |

### File Structure

```
.env.local          # Local env (NOT committed to git)
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## 🔗 Stripe Webhooks Setup

Stripe webhooks are used to receive payment events (e.g., `payment_intent.succeeded`, `payment_intent.payment_failed`) and update your database accordingly.

### Steps to Configure

1. **Go to the Stripe Dashboard**
   Navigate to [Developers → Webhooks](https://dashboard.stripe.com/test/webhooks).

2. **Add an Endpoint**
   - **Endpoint URL**: `https://your-domain.com/api/webhooks/stripe`
     (Use `http://localhost:3000/api/webhooks/stripe` for local development)
   - **Secret**: Copy the **Signing Secret** (`whsec_...`) and add it to your `.env` as `STRIPE_WEBHOOK_SECRET`.

3. **Select Events to Listen To**
   At minimum, select:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

4. **Deploy Your App**
   Webhooks only work on a publicly accessible URL (e.g., Vercel). For local testing, use Stripe CLI:

   ```bash
   # Install Stripe CLI
   # https://stripe.com/docs/stripe-cli

   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

   Then start your app with `npm run dev` in another terminal.

### Webhook Flow

```
Stripe Event → /api/webhooks/stripe → Verify Signature → Update DB → Respond 200 OK
```

---

## 📖 How to Use

### As a Customer

1. Browse the [menu](http://localhost:3000/menu) and add items to your cart.
2. View your [cart](http://localhost:3000/cart) and proceed to [checkout](http://localhost:3000/checkout).
3. Choose delivery or pickup, enter your details, and place your order.
4. Track your order on the [orders](http://localhost:3000/orders) page.
5. Sign up for [VIP membership](http://localhost:3000/account) to earn points and unlock tier perks.
6. Reserve a table via the [reservation](http://localhost:3000/reserve) page.

### As an Admin

1. Sign in and navigate to the [admin dashboard](http://localhost:3000/admin).
2. Manage menu items, view all orders, update order statuses, and manage reservations.
3. Monitor VIP members and their tier progression.

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the app for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate a Drizzle migration file |
| `npm run db:migrate` | Run pending migrations |
| `npm run db:push` | Push schema to the database (dev) |
| `npm run db:studio` | Open Drizzle Studio (visual DB GUI) |
| `npm run db:seed` | Seed the database with sample data |

---

## 🚢 Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/new) and import your repository.
3. Add all environment variables from the `.env` section above in the Vercel project settings.
4. Deploy!

### Environment Variables for Production

Make sure to set all the same variables listed in the `.env` section, but with your production values (e.g., production Stripe keys, production DATABASE_URL, and your live domain URL for `NEXT_PUBLIC_APP_URL`).

---

## 💡 Customization

- **Branding**: Update colors in `tailwind.config.ts` and the Clerk dashboard.
- **Menu Items**: Edit seed data in `src/db/seed.ts` or add via the admin panel.
- **VIP Tiers**: Adjust tier thresholds in `src/app/api/vip/points/route.ts`.
- **Delivery Fee**: Change the delivery fee in `src/app/api/orders/route.ts`.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/amazing-feature`.
3. Commit your changes: `git commit -m "Add amazing feature"`.
4. Push to the branch: `git push origin feature/amazing-feature`.
5. Open a Pull request.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For questions, issues, or feedback, please open a [GitHub issue](https://github.com/<your-username>/vip-setup/issues) or reach out to the development team.

---

Built with ❤️ using [Next.js](https://nextjs.org), [Drizzle ORM](https://drizzle.orm), [Clerk](https://clerk.com), and [Stripe](https://stripe.com).