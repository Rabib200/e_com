import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface ExecutePaymentRequest {
    paymentID: string;
    token: string;
}

interface BkashExecuteResponse {
    statusCode: string;
    statusMessage: string;
    paymentID: string;
    trxID: string;
    amount: string;
    transactionStatus: string;
}

serve(async (req) => {
    if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: { "Content-Type": "application/json" },
        });
    }

    const body = await req.json() as Partial<ExecutePaymentRequest>;
    const { paymentID, token } = body;

    if (!paymentID || !token) {
        return new Response(
            JSON.stringify({ error: "Missing paymentID or token" }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            },
        );
    }

    const bkashBaseUrl = Deno.env.get("BKASH_BASE_URL")!;
    const bkashAppKey = Deno.env.get("BKASH_APP_KEY")!;

    const bkashRes = await fetch(`${bkashBaseUrl}/tokenized/checkout/execute`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
            "X-APP-Key": bkashAppKey,
        },
        body: JSON.stringify({ paymentID }),
    });

    if (!bkashRes.ok) {
        const errorText = await bkashRes.text();
        console.error("bKash Execute Error:", errorText);

        return new Response(
            JSON.stringify({
                error: "bKash execute-payment failed",
                details: errorText,
            }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }

    const bkashData: BkashExecuteResponse = await bkashRes.json();

    return new Response(JSON.stringify(bkashData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
});
