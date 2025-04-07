export async function POST(request: Request) {
    try {
        const requestData = await request.json();
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const executePaymentUrl = `${supabaseUrl}/functions/v1/execute-payment`;

        const result = await fetch(executePaymentUrl, {
            method: "POST",
            body: JSON.stringify(requestData),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${supabaseAnonKey}`,
            },
        });

        return new Response(JSON.stringify(await result.json()), {
            status: result.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        console.error("Error executing payment:", error);

        // Return appropriate error message and status
        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.error ||
            error.message ||
            "Failed to execute payment";

        return new Response(JSON.stringify({ error: errorMessage }), {
            status: statusCode,
            headers: { "Content-Type": "application/json" },
        });
    }
}
