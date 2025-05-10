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
            .eq("product_id", productId);

        if (error) {
            console.error("Error fetching sizes:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Define custom sort order for common clothing sizes
        const sizeOrder: { [key: string]: number } = {
            "XXS": 0,
            "XS": 1,
            "S": 2,
            "M": 3,
            "L": 4,
            "XL": 5,
            "XXL": 6,
            "XXXL": 7,
            "3XL": 7,
            "4XL": 8,
            "5XL": 9,
            "6XL": 10,
        };

        // Sort the data based on the custom order
        const sortedData = data.sort((a, b) => {
            const sizeA = a.size.toUpperCase();
            const sizeB = b.size.toUpperCase();

            // If both sizes exist in our order map
            if (
                sizeOrder[sizeA] !== undefined && sizeOrder[sizeB] !== undefined
            ) {
                return sizeOrder[sizeA] - sizeOrder[sizeB];
            }

            // If only one size exists in our order map
            if (sizeOrder[sizeA] !== undefined) return -1;
            if (sizeOrder[sizeB] !== undefined) return 1;

            // For numeric sizes (like 38, 40, 42)
            const numA = parseInt(sizeA);
            const numB = parseInt(sizeB);
            if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
            }

            // Fallback to alphabetical order for any other sizes
            return sizeA.localeCompare(sizeB);
        });

        return NextResponse.json({
            success: true,
            sizes: sortedData || [],
        });
    } catch (error) {
        console.error("Error fetching sizes:", error);
        return NextResponse.json(
            { error: "Failed to fetch sizes" },
            { status: 500 },
        );
    }
}
