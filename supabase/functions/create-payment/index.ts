// Supabase Edge Function with Deno Deploy (Deno.serve)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface BkashPaymentRequest {
    accessToken: string;
    amount: string;
    currency: string;
    intent: string;
    merchantInvoiceNumber: string;
}

serve(async (req: Request) => {
    try {
        if (req.method !== "POST") {
            return new Response(
                JSON.stringify({ error: "Method not allowed" }),
                {
                    status: 405,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }

        // Parse request body only ONCE
        const requestData: BkashPaymentRequest = await req.json();
        const { accessToken } = requestData;

        // Get environment variables
        const BKASH_APP_KEY = Deno.env.get("BKASH_APP_KEY");
        const BKASH_USERNAME = Deno.env.get("BKASH_USERNAME");
        const BKASH_PASSWORD = Deno.env.get("BKASH_PASSWORD");
        const BKASH_BASE_URL = Deno.env.get("BKASH_BASE_URL");

        if (!accessToken) {
            return new Response(
                JSON.stringify({ error: "Access token is required" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }

        // Set up payment creation URL
        const createPaymentUrl = `${BKASH_BASE_URL}/tokenized/checkout/create`;

        // Set up headers
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "X-APP-Key": BKASH_APP_KEY || "",
        };

        if (BKASH_USERNAME) {
            headers["username"] = BKASH_USERNAME;
        }

        if (BKASH_PASSWORD) {
            headers["password"] = BKASH_PASSWORD;
        }

        // Set up payment request body
        const paymentBody = JSON.stringify({
            mode: "0011",
            payerReference: " ",
            callbackURL: "https://e-com-six-rouge.vercel.app/callback",
            amount: requestData.amount,
            currency: requestData.currency || "BDT",
            intent: requestData.intent || "sale",
            merchantInvoiceNumber: requestData.merchantInvoiceNumber,
        });

        // Make the request to bKash API
        const res = await fetch(createPaymentUrl, {
            method: "POST",
            headers: headers,
            body: paymentBody,
        });

        // Handle response
        if (!res.ok) {
            const error = await res.json();
            return new Response(
                JSON.stringify({ error }),
                {
                    status: res.status,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }

        const data = await res.json();

        return new Response(
            JSON.stringify(data),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            },
        );
    } catch (error) {
        console.error("Error creating payment:", error);
        return new Response(
            JSON.stringify({ error: (error as Error).message }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            },
        );
    }
});
