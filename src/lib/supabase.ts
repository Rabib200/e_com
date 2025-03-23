import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Axios instance with default headers
const axiosInstance = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`, // Supabase REST API
  headers: {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  },
});

export { supabase, axiosInstance };
