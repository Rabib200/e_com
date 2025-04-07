// Supabase Edge Function with Deno Deploy (Deno.serve)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async () => {
    const BKASH_APP_KEY = Deno.env.get("BKASH_APP_KEY");
    const BKASH_APP_SECRET = Deno.env.get("BKASH_APP_SECRET");
    const BKASH_USERNAME = Deno.env.get("BKASH_USERNAME");
    const BKASH_PASSWORD = Deno.env.get("BKASH_PASSWORD");
    const BKASH_BASE_URL = Deno.env.get("BKASH_BASE_URL");

    console.log("All ENV:", Deno.env.toObject());

    const tokenUrl = `${BKASH_BASE_URL}/tokenized/checkout/token/grant`;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
    };

    if (BKASH_USERNAME) {
        headers["username"] = BKASH_USERNAME;
    }

    if (BKASH_PASSWORD) {
        headers["password"] = BKASH_PASSWORD;
    }

    const body = JSON.stringify({
        app_key: BKASH_APP_KEY,
        app_secret: BKASH_APP_SECRET,
    });

    try {
        const res = await fetch(tokenUrl, {
            method: "POST",
            body,
            headers: headers,
        });

        if (!res.ok) {
            const error = await res.json();
            return new Response(JSON.stringify({ error }), {
                status: res.status,
            });
        }

        const data = await res.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: (error as Error).message }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            },
        );
    }
});
