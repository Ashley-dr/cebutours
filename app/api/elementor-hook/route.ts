/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.WC_STORE_URL!,
  consumerKey:
    process.env.WC_CONSUMER_KEY || "ck_fa2d263feeda085ca23ab57dcc37969d7b324eba",
  consumerSecret:
    process.env.WC_CONSUMER_SECRET || "cs_b48ea788a7d0ad2dbf0a4f807c46b1f5f0ea5e55",
  version: "wc/v3",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, tour_date, guests, noofpax, amount } = body;

    const productRes = await api.post("products", {
      name: `Tour Reservation - ${tour_date}`,
      type: "simple",
      regular_price: amount,
    });

    const productId = productRes.data.id;

    const orderRes = await api.post("orders", {
      set_paid: false,
      billing: {
        first_name: name,
        email,
      },
      meta_data: [
        { key: "Tour Date", value: tour_date },
        { key: "Number of Pax", value: noofpax },
        { key: "Guests", value: guests },
      ],
      line_items: [
        {
          product_id: productId,
          quantity: 1,
        },
      ],
    });

    const checkoutUrl = orderRes.data.checkout_url;

    return NextResponse.json({
      success: true,
      checkoutUrl,
    });
  } catch (error: any) {
    console.error("Error creating order:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
