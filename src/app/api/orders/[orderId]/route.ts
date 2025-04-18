import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { ErrorWithResponse } from "@/lib/errorTemplate";

// Update the type definition for params to match Next.js 15.x requirements
export async function GET(
  request: Request,
  context: { params: { orderId: string } }
) {
  try {
    const { orderId } = context.params;

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

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Fetch order details
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

    // Fetch order items
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

    // Combine order and items data in the format expected by the frontend
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
      transactionId: order.transaction_id
    };

    return NextResponse.json(responseData);
  } catch (error: unknown) {
    console.error("Error fetching order:", error);

    const typedError = error as ErrorWithResponse;
    // Return appropriate error message and status
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