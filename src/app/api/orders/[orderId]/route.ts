import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { ErrorWithResponse } from "@/lib/errorTemplate";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pathnameParts = url.pathname.split("/");
    const orderId = pathnameParts[pathnameParts.length - 1]; // Get [orderId]

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase environment variables not set");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError) {
      console.error("Error fetching order:", orderError);
      return NextResponse.json(
        { error: `Failed to fetch order: ${orderError.message}` },
        { status: 500 }
      );
    }

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (itemsError) {
      console.error("Error fetching order items:", itemsError);
      return NextResponse.json(
        {
          error: `Failed to fetch order items: ${itemsError.message}`,
        },
        { status: 500 }
      );
    }

    const responseData = {
      id: order.id,
      status: order.status.toLowerCase(),
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      items: items,
      totalAmount: order.paid_amount,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      shippingAddress: order.shipping_address,
      city: order.city,
      paymentStatus: order.payment_status,
      transactionId: order.transaction_id,
    };

    return NextResponse.json(responseData);
  } catch (error: unknown) {
    console.error("Error fetching order:", error);

    const typedError = error as ErrorWithResponse;
    const statusCode = typedError.response?.status || 500;
    const errorMessage =
      typedError.response?.data?.error ||
      typedError.message ||
      "Failed to fetch order";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: { "Content-Type": "application/json" },
    });
  }
}