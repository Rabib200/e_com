import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
    request: NextRequest,
) {
    try {
        const url = new URL(request.url);
        const pathnameParts = url.pathname.split("/");
        const productId = pathnameParts[pathnameParts.length - 1];

        if (!productId) {
            return NextResponse.json(
                { error: "Product ID is required" },
                { status: 400 },
            );
        }

        console.log("Fetching sizes for product ID:", productId);

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error("Supabase environment variables not set");
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Get all sizes for this product
        const { data, error } = await supabase
            .from("sizes")
            .select("*")
            .eq("product_id", productId)
            .order("size", { ascending: false });

        if (error) {
            console.error("Error fetching sizes:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            sizes: data || [],
        });
    } catch (error) {
        console.error("Error fetching sizes:", error);
        return NextResponse.json(
            { error: "Failed to fetch sizes" },
            { status: 500 },
        );
    }
}
