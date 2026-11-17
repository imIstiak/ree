import Link from "next/link";
import { Chip, PageHead, dhakaTime, input, panel, quietButton } from "../../../../components/backroom/ui";
import { formatPrice } from "../../../../data/products";
import { listOrders, orderCounts } from "../../../../lib/backroom-data";
import { orderStatuses } from "../../../../lib/supabase";

// Orders, newest first: a tab per status with its count, a search over number, name and phone,
// and one row per order leading to its page. Shows the latest 200.
export default async function OrdersPage({ searchParams }: PageProps<"/backroom/orders">) {
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : undefined;
  const q = typeof params.q === "string" ? params.q : undefined;
  const [orders, counts] = await Promise.all([listOrders({ status, q }), orderCounts()]);
  const tabs = [{ value: undefined, label: "All", count: counts.all }, ...orderStatuses.map((value) => ({ value, label: value, count: counts[value] }))];
  const href = (next: string | undefined) => {
    const search = new URLSearchParams();
    if (next) search.set("status", next);
    if (q) search.set("q", q);
    const query = search.toString();
    return query ? `/backroom/orders?${query}` : "/backroom/orders";
  };

  return (
    <>
      <PageHead kicker={`${counts.new} new · ${counts.all} in all`} title="Orders" />

      <div className="flex flex-col gap-4 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Order status" className="flex flex-wrap gap-2">
          {tabs.map((tab, index) => {
            const current = tab.value === status;
            return (
              <Link
                key={tab.label}
                href={href(tab.value)}
                aria-current={current ? "page" : undefined}
                className={`lp-patch inline-flex min-h-10 items-center gap-2 px-3 text-[11px] tracking-[.1em] uppercase [--lp-stitch-inset:3px] ${index % 2 ? "rotate-[.5deg]" : "-rotate-[.5deg]"} ${current ? "rotate-0 bg-lp-brand text-lp-brand-base" : "bg-lp-card hover:bg-lp-accent hover:text-lp-ink"}`}
              >
                {tab.label}
                <span className="opacity-60">{tab.count}</span>
              </Link>
            );
          })}
        </nav>
        <form className="flex gap-2" role="search">
          {status && <input type="hidden" name="status" value={status} />}
          <label className="sr-only" htmlFor="order-search">
            Search orders
          </label>
          <input id="order-search" name="q" defaultValue={q} placeholder="Number, name or phone" className={`${input} mt-0 w-64`} />
          <button className={quietButton}>Search</button>
        </form>
      </div>

      {orders.length === 0 ? (
        <div className={`${panel} px-6 py-12 text-center`}>
          <p className="font-lp-display text-xl uppercase">{q || status ? "No orders match" : "No orders yet"}</p>
          <p className="mt-2 text-[12px] text-lp-muted">{q || status ? "Try another status or search." : "Orders placed at checkout will appear here."}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/backroom/orders/${order.id}`}
                className={`${panel} grid gap-x-6 gap-y-2 px-5 py-4 transition-[translate,box-shadow] hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none sm:grid-cols-[8rem_minmax(0,1fr)_auto] lg:grid-cols-[8rem_minmax(0,1.4fr)_minmax(0,1fr)_6rem_auto]`}
              >
                <span>
                  <span className="block font-lp-display text-base">{order.number}</span>
                  <span className="block text-[11px] text-lp-muted">{dhakaTime.format(new Date(order.created_at))}</span>
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px]">{order.customer_name}</span>
                  <span className="block text-[11px] text-lp-muted">{order.phone}</span>
                </span>
                <span className="hidden min-w-0 text-[11px] text-lp-muted lg:block">
                  <span className="block truncate">{order.city}</span>
                  <span className="block">
                    {order.items} {order.items === 1 ? "piece" : "pieces"} · {order.payment_method === "cod" ? "Cash" : "bKash / Nagad"}
                  </span>
                </span>
                <span className="font-lp-display text-base sm:text-right">{formatPrice(order.total)}</span>
                <span className="flex flex-wrap items-start gap-1.5 sm:justify-end">
                  <Chip kind="status" value={order.status} />
                  <Chip kind="payment" value={order.payment_status} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
