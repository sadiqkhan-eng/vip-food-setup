"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: "delivery" | "pickup";
  deliveryAddress: string | null;
  status: string;
  subtotal: string;
  deliveryFee: string;
  total: string;
  specialInstructions: string | null;
  clerkUserId: string | null;
  createdAt: string;
}

interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  partySize: number;
  reservationDate: string;
  status: string;
  specialRequests: string | null;
  createdAt: string;
}

interface TableBooking {
  id: string;
  tableId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  partySize: number;
  bookingDate: string;
  duration: number;
  status: string;
  specialRequests: string | null;
  createdAt: string;
}

interface VIPMember {
  id: string;
  clerkUserId: string;
  tier: string;
  points: number;
  totalSpent: string;
  memberSince: string;
  createdAt: string;
}

interface Table {
  id: string;
  tableNumber: string;
  capacity: number;
  isVipLounge: boolean;
  isAvailable: boolean;
  location: string;
}

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "reservations" | "tables" | "vip">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tableBookings, setTableBookings] = useState<TableBooking[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [vipMembers, setVipMembers] = useState<VIPMember[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.publicMetadata?.role === "admin";

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in?redirect_url=/admin");
    }
    if (isLoaded && user && !isAdmin) {
      router.push("/");
    }
  }, [isLoaded, user, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      const [ordersRes, reservationsRes, tablesRes, bookingsRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/reservations"),
        fetch("/api/tables"),
        fetch("/api/tables"),
      ]);
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (reservationsRes.ok) setReservations(await reservationsRes.json());
      if (tablesRes.ok) {
        const data = await tablesRes.json();
        setTables(data.tables || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o))
        );
      }
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const updateReservationStatus = async (reservationId: string, status: string) => {
    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        setReservations((prev) =>
          prev.map((r) => (r.id === reservationId ? { ...r, status } : r))
        );
      }
    } catch (error) {
      console.error("Failed to update reservation:", error);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`/api/tables/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        setTableBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
        );
      }
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-purple-100 text-purple-800",
      out_for_delivery: "bg-indigo-100 text-indigo-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      seated: "bg-teal-100 text-teal-800",
      no_show: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      bronze: "bg-[#CD7F32] text-white",
      silver: "bg-[#C0C0C0] text-gray-800",
      gold: "bg-[#C9992E] text-white",
      platinum: "bg-[#E5E4E2] text-gray-800",
    };
    return colors[tier] || "bg-gray-100 text-gray-800";
  };

  if (!isLoaded || (isLoaded && !user)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-maroon border-t-transparent" />
          <p className="text-ink/60">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold text-ink mb-2">Access Denied</h2>
          <p className="text-ink/60 mb-6">You don&apos;t have admin privileges.</p>
          <Link href="/" className="rounded-full bg-maroon px-6 py-2.5 text-sm font-semibold text-white hover:bg-maroon-dark transition-colors focus-ring">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-maroon border-t-transparent" />
        <p className="text-ink/60">Loading dashboard...</p>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "confirmed").length;
  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink">
            VIP Setup Admin
          </h1>
          <p className="text-ink/50 text-sm mt-1">
            Welcome back, {user.firstName}. Here&apos;s your business overview.
          </p>
        </div>
        <span className="inline-flex items-center rounded-full bg-maroon/10 px-4 py-1.5 text-xs font-bold text-maroon uppercase tracking-wide">
          Admin
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl bg-parchment border border-gold/20 p-5">
          <p className="text-xs font-semibold text-ink/50 uppercase tracking-wide mb-1">Total Revenue</p>
          <p className="font-display text-2xl font-bold text-maroon">Rs. {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl bg-parchment border border-gold/20 p-5">
          <p className="text-xs font-semibold text-ink/50 uppercase tracking-wide mb-1">Pending Orders</p>
          <p className="font-display text-2xl font-bold text-gold-dark">{pendingOrders}</p>
        </div>
        <div className="rounded-2xl bg-parchment border border-gold/20 p-5">
          <p className="text-xs font-semibold text-ink/50 uppercase tracking-wide mb-1">Today&apos;s Orders</p>
          <p className="font-display text-2xl font-bold text-ink">{todayOrders}</p>
        </div>
        <div className="rounded-2xl bg-parchment border border-gold/20 p-5">
          <p className="text-xs font-semibold text-ink/50 uppercase tracking-wide mb-1">VIP Members</p>
          <p className="font-display text-2xl font-bold text-[#C9992E]">{vipMembers.length}</p>
        </div>
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {[
          { key: "orders" as const, label: "Orders", count: orders.length },
          { key: "reservations" as const, label: "Reservations", count: reservations.length },
          { key: "tables" as const, label: "Tables", count: tables.length },
          { key: "vip" as const, label: "VIP Members", count: vipMembers.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all focus-ring whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-maroon text-white shadow-md shadow-maroon/20"
                : "bg-parchment text-ink/70 hover:bg-maroon/5 border border-gold/20"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {activeTab === "orders" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-parchment border border-gold/20">
              <p className="text-ink/60 text-lg">No orders yet.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="rounded-2xl bg-parchment p-6 border border-gold/20">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="font-display font-semibold text-ink">{order.customerName}</p>
                    <p className="text-sm text-ink/60">{order.customerPhone} · {order.customerEmail}</p>
                    <p className="text-sm text-ink/50">
                      {order.orderType === "delivery" ? "Delivery" : "Pickup"} ·{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl font-bold text-maroon">Rs. {parseFloat(order.total).toLocaleString()}</p>
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold mt-1 ${getStatusColor(order.status)}`}>
                      {order.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                </div>
                {order.deliveryAddress && (
                  <p className="text-sm text-ink/60 mb-3"><strong>Address:</strong> {order.deliveryAddress}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {["confirmed", "preparing", "out_for_delivery", "completed", "cancelled"].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(order.id, status)}
                      disabled={order.status === status}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors focus-ring ${
                        order.status === status
                          ? "bg-maroon text-white"
                          : "bg-cream text-ink/60 hover:bg-maroon/10 border border-gold/20"
                      }`}
                    >
                      {status.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "reservations" && (
        <div className="space-y-4">
          {reservations.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-parchment border border-gold/20">
              <p className="text-ink/60 text-lg">No reservations yet.</p>
            </div>
          ) : (
            reservations.map((reservation) => (
              <div key={reservation.id} className="rounded-2xl bg-parchment p-6 border border-gold/20">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="font-display font-semibold text-ink">{reservation.customerName}</p>
                    <p className="text-sm text-ink/60">{reservation.customerPhone} · {reservation.customerEmail}</p>
                    <p className="text-sm text-ink/50">
                      Party of {reservation.partySize} ·{" "}
                      {new Date(reservation.reservationDate).toLocaleString()}
                    </p>
                  </div>
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(reservation.status)}`}>
                    {reservation.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["confirmed", "seated", "completed", "cancelled", "no_show"].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateReservationStatus(reservation.id, status)}
                      disabled={reservation.status === status}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors focus-ring ${
                        reservation.status === status
                          ? "bg-maroon text-white"
                          : "bg-cream text-ink/60 hover:bg-maroon/10 border border-gold/20"
                      }`}
                    >
                      {status.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "tables" && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-parchment p-6 border border-gold/20">
            <h3 className="font-display text-lg font-bold text-ink mb-4">Restaurant Tables</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {tables.map((table) => (
                <div
                  key={table.id}
                  className={`rounded-xl p-4 text-center border ${
                    table.isVipLounge
                      ? "bg-[#241A12] border-[#C9992E]/30 text-white"
                      : "bg-white border-gold/20 text-ink"
                  }`}
                >
                  <p className="font-bold text-lg">{table.tableNumber}</p>
                  <p className="text-xs opacity-70">{table.capacity} seats</p>
                  <p className="text-xs opacity-50 mt-1">{table.location}</p>
                  {table.isVipLounge && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-[#C9992E]/20 text-[#C9992E] text-[10px] font-bold rounded-full">
                      VIP
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "vip" && (
        <div className="space-y-4">
          {vipMembers.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-parchment border border-gold/20">
              <p className="text-ink/60 text-lg">No VIP members yet.</p>
              <p className="text-ink/40 text-sm mt-1">Members will appear here after placing orders.</p>
            </div>
          ) : (
            vipMembers.map((member) => (
              <div key={member.id} className="rounded-2xl bg-parchment p-6 border border-gold/20">
                <div className="flex flex-wrap items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getTierColor(member.tier)}`}>
                    {member.tier.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-semibold text-ink">Member #{member.clerkUserId.slice(-8)}</p>
                    <p className="text-sm text-ink/60">
                      {member.points} points · Rs. {parseFloat(member.totalSpent).toLocaleString()} spent
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getTierColor(member.tier)}`}>
                    {member.tier}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
