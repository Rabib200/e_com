import axios from "axios";

export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        // Call the Supabase edge function instead of directly accessing bKash
        const tokenUrl = `${supabaseUrl}/functions/v1/get-token`;

        const result = await axios.get(tokenUrl, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${supabaseAnonKey}`,
            },
        });

        // Return the data from the edge function
        return new Response(JSON.stringify(result.data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        console.error("Error getting token:", error);

        // Return appropriate error message and status
        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.error || error.message ||
            "Failed to get token";

        return new Response(JSON.stringify({ error: errorMessage }), {
            status: statusCode,
            headers: { "Content-Type": "application/json" },
        });
    }
}
