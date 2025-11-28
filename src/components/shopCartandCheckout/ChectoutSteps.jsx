"use client";

import { usePathname, useParams } from "next/navigation";
import { useRouter } from "next/router";
import Link from "next/link";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const steps = [
  {
    id: 1,
    href: "/shop_cart",
    number: "01",
    title: "Shopping Bag",
    description: "Manage Your Items List",
  },
  {
    id: 2,
    href: "/shop_checkout",
    number: "02",
    title: "Shipping and Checkout",
    description: "Checkout Your Items List",
  },
  {
    id: 3,
    href: "/success-order",
    number: "03",
    title: "Confirmation",
    description: "Review And Submit Your Order",
  },
];
export default function ChectoutSteps() {
  const [activePathIndex, setactivePathIndex] = useState(0);
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const stepperCompletedPages = useSelector((state) => state.stepperCompletedPage);

  useEffect(() => {
    const activeTab = steps.filter((elm) => elm.href == pathname)[0];
    const activeTabIndex = steps.indexOf(activeTab);
    setactivePathIndex(activeTabIndex);
  }, [pathname]);
  return (
    <div className="checkout-steps">
      {steps.map((elm, i) => (
        <Link
          key={i}
          href={ stepperCompletedPages > i+1 ? elm.href : ""}
          className={`checkout-steps__item  ${
            (activePathIndex >= i || params.succesOrderId) &&
            stepperCompletedPages >= i+1
              ? "active"
              : ""
          }`}
          refresh="true"
        >
          <span className="checkout-steps__item-number">{elm.number}</span>
          <span className="checkout-steps__item-title">
            <span>{elm.title}</span>
            <em>{elm.description}</em>
          </span>
        </Link>
      ))}
    </div>
  );
}
