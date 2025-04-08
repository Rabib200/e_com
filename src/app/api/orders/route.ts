import { ErrorWithResponse } from "@/lib/errorTemplate";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Define interfaces for type safety
interface PaymentDetails {
    trxID?: string;
    paymentID?: string;
    amount?: number | string;
    currency?: string;
    transactionStatus?: string;
}

interface CustomerInfo {
    fullName: string;
    email: string;
    phone: string;
    streetAddress: string;
    city: string;
}

interface CartItem {
    id: string;
    title: string;
    price: string | number;
    quantity: number;
    size?: string;
    discountPrice?: string | number | null;
    image?: string[];
}

interface OrderData {
    paymentDetails: PaymentDetails;
    customerInfo: CustomerInfo;
    items: CartItem[];
    orderDate: string;
    totalAmount: number | string;
}

export async function POST(request: Request) {
    try {
        const orderData: OrderData = await request.json();
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error("Supabase environment variables not set");
        }

        // Initialize Supabase client
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Ensure we have the necessary data
        if (
            !orderData.customerInfo || !orderData.items ||
            orderData.items.length === 0
        ) {
            return NextResponse.json(
                { error: "Missing required order information" },
                { status: 400 },
            );
        }

        // Convert amount to number if it's a string
        let totalAmount: number;
        if (typeof orderData.totalAmount === "string") {
            totalAmount =
                parseFloat(orderData.totalAmount.replace(/[^0-9.-]+/g, "")) ||
                0;
        } else {
            totalAmount = orderData.totalAmount || 0;
        }

        // Create an order record
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                customer_name: orderData.customerInfo.fullName,
                customer_email: orderData.customerInfo.email,
                customer_phone: orderData.customerInfo.phone,
                shipping_address: orderData.customerInfo.streetAddress,
                city: orderData.customerInfo.city,
                total_amount: totalAmount,
                payment_status: orderData.paymentDetails.transactionStatus ||
                    "Completed",
                payment_id: orderData.paymentDetails.paymentID,
                transaction_id: orderData.paymentDetails.trxID,
                payment_method: "bkash",
            })
            .select()
            .single();

        if (orderError) {
            console.error("Error creating order:", orderError);
            return NextResponse.json(
                { error: `Failed to create order: ${orderError.message}` },
                { status: 500 },
            );
        }

        // Process items for the order
        const orderItems = orderData.items.map((item) => {
            // Convert price to number if it's a string
            let unitPrice: number;
            if (typeof item.price === "string") {
                unitPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, "")) ||
                    0;
            } else {
                unitPrice = item.price as number;
            }

            // Use discount price if available
            if (item.discountPrice) {
                let discountPrice: number;
                if (typeof item.discountPrice === "string") {
                    discountPrice = parseFloat(
                        item.discountPrice.replace(/[^0-9.-]+/g, ""),
                    ) || unitPrice;
                } else {
                    discountPrice = item.discountPrice as number;
                }
                unitPrice = discountPrice;
            }

            // Create a complete item object for JSONB storage
            const completeItem = {
                id: item.id,
                title: item.title,
                price: unitPrice,
                originalPrice: typeof item.price === "string"
                    ? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) || 0
                    : item.price,
                quantity: item.quantity,
                size: item.size || null,
                image: item.image || [],
                discountPrice: item.discountPrice ? unitPrice : null,
            };

            return {
                order_id: order.id,
                product_name: item.title,
                quantity: item.quantity,
                unit_price: unitPrice,
                total_price: unitPrice * item.quantity,
                // Store complete item details in the JSONB field
                items: completeItem,
            };
        });

        // Insert order items
        const { error: itemsError } = await supabase
            .from("order_items")
            .insert(orderItems);

        if (itemsError) {
            console.error("Error creating order items:", itemsError);
            return NextResponse.json(
                {
                    error:
                        `Failed to create order items: ${itemsError.message}`,
                },
                { status: 500 },
            );
        }

        // Return success response
        return NextResponse.json({
            success: true,
            message: "Order created successfully",
            orderId: order.id,
        });
    } catch (error: unknown) {
        console.error("Error processing order:", error);

        const typedError = error as ErrorWithResponse;
        // Return appropriate error message and status
        const statusCode = typedError.response?.status || 500;
        const errorMessage = typedError.response?.data?.error ||
            typedError.message ||
            "Failed to process order";

        return new Response(JSON.stringify({ error: errorMessage }), {
            status: statusCode,
            headers: { "Content-Type": "application/json" },
        });
    }
}
