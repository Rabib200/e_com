import { ErrorWithResponse } from "@/lib/errorTemplate";
import axios from "axios";

export async function POST(request: Request) {
    try {
        const requestData = await request.json();
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const createPaymentUrl = `${supabaseUrl}/functions/v1/create-payment`;

        const result = await axios.post(createPaymentUrl, requestData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${supabaseAnonKey}`,
            },
        });

        return new Response(JSON.stringify(result.data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: unknown) {
        console.error("Error creating payment:", error);

        const typedError = error as ErrorWithResponse;
        // Return appropriate error message and status
        const statusCode = typedError.response?.status || 500;
        const errorMessage = typedError.response?.data?.error ||
            typedError.message ||
            "Failed to create payment";

        return new Response(JSON.stringify({ error: errorMessage }), {
            status: statusCode,
            headers: { "Content-Type": "application/json" },
        });
    }
}
