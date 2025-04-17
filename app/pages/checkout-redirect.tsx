// pages/checkout-redirect.tsx

"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function CheckoutRedirect() {
  const router = useRouter();

  useEffect(() => {
    const checkoutUrl = sessionStorage.getItem("checkoutUrl");
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      // fallback
      router.push("/");
    }
  }, [router]);

  return <p>Redirecting to checkout...</p>;
}
