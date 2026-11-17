import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CrumbLabel } from "../../../../../components/backroom/crumbs";
import { OrderForm } from "../../../../../components/backroom/order-form";
import { Chip, PageHead, dhakaDate, panel, quietButton } from "../../../../../components/backroom/ui";
import { deliveryAreas } from "../../../../../data/checkout";
import { formatPrice } from "../../../../../data/products";
import { getOrder } from "../../../../../lib/backroom-data";

// One order: what was bought (copied at the time of the order), who to call, where it goes, the
// money, and the form that moves it along.
export default async function OrderPage({ params }: PageProps<"/backroom/orders/[id]">) {
  const found = await getOrder((await params).id);
  if (!found) notFound();
  const { order, items } = found;
  const area = deliveryAreas.find((option) => option.id === order.area)?.label ?? order.area;

  return (
    <>
      <CrumbLabel id={order.id} label={order.number} />
      <PageHead kicker={`Placed ${dhakaDate.format(new Date(order.created_at))}`} title={order.number}>
        <Link href="/backroom/orders" className={quietButton}>
          ← All orders
        </Link>
      </PageHead>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section aria-labelledby="items" className={`${panel} px-6 py-5`}>
            <div className="flex items-center justify-between gap-4">
              <h2 id="items" className="font-lp-display text-lg uppercase">
                Pieces
              </h2>
              <span className="flex gap-1.5">
                <Chip kind="status" value={order.status} />
                <Chip kind="payment" value={order.payment_status} />
              </span>
            </div>
            <ul className="mt-4 divide-y divide-dashed divide-lp-border">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-3">
                  <span className="relative aspect-[4/5] w-12 flex-none overflow-hidden bg-lp-surface">
                    {item.image && <Image src={item.image} alt="" fill sizes="48px" className="object-cover" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px]">{item.name}</span>
                    <span className="block text-[11px] text-lp-muted">
                      Size {item.size} · {item.qty} × {formatPrice(item.unit_price)}
                    </span>
                  </span>
                  <span className="font-lp-display text-sm">{formatPrice(item.qty * item.unit_price)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1 border-t border-lp-border pt-3 text-[12px]">
              <div className="flex justify-between">
                <dt className="text-lp-muted">Subtotal</dt>
                <dd>{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-lp-muted">Delivery · {area}</dt>
                <dd>{order.delivery_fee === 0 ? "Free" : formatPrice(order.delivery_fee)}</dd>
              </div>
              <div className="flex justify-between font-lp-display text-base">
                <dt>Total, on delivery</dt>
                <dd>{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="customer" className={`${panel} grid gap-6 px-6 py-5 sm:grid-cols-2`}>
            <div>
              <h2 id="customer" className="font-lp-display text-lg uppercase">
                Customer
              </h2>
              <p className="mt-3 text-[13px]">{order.customer_name}</p>
              <p className="mt-1 text-[13px]">
                <a href={`tel:${order.phone.replace(/[^\d+]/g, "")}`} className="underline underline-offset-4">
                  {order.phone}
                </a>
              </p>
              {order.email && (
                <p className="mt-1 text-[13px]">
                  <a href={`mailto:${order.email}`} className="underline underline-offset-4">
                    {order.email}
                  </a>
                </p>
              )}
              <p className="mt-3 text-[11px] text-lp-muted">Pays {order.payment_method === "cod" ? "in cash" : "by bKash or Nagad"} on delivery.</p>
            </div>
            <div>
              <h2 className="font-lp-display text-lg uppercase">Deliver to</h2>
              <p className="mt-3 text-[13px] leading-relaxed whitespace-pre-line">{order.address}</p>
              <p className="mt-1 text-[13px]">
                {order.city} · {area}
              </p>
              {order.note && <p className="mt-3 border-l-2 border-lp-accent pl-3 text-[12px] italic">“{order.note}”</p>}
            </div>
          </section>
        </div>

        <OrderForm id={order.id} status={order.status} paymentStatus={order.payment_status} adminNote={order.admin_note} />
      </div>
    </>
  );
}
