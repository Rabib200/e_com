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

// Constants for storage buckets
const BUCKET_PRODUCT_IMAGES = "ecom";

/**
 * Initialize storage buckets if they don't exist
 * This should be called during app initialization
 */
export const initializeStorage = async () => {
  try {
    // Check if product images bucket exists, create if it doesn't
    const { data: buckets } = await supabase.storage.listBuckets();

    if (!buckets?.find((bucket) => bucket.name === BUCKET_PRODUCT_IMAGES)) {
      const { error } = await supabase.storage.createBucket(
        BUCKET_PRODUCT_IMAGES,
        {
          public: true, // Make files publicly accessible
          fileSizeLimit: 5242880, // 5MB limit
        }
      );

      if (error) {
        console.error("Error creating product images bucket:", error);
      } else {
        console.log("Created product images bucket");
      }
    }
  } catch (error) {
    console.error("Error initializing storage:", error);
  }
};

/**
 * Upload a file to product images bucket
 * @param file File object to upload
 * @param path Path within the bucket (e.g. 'product-123/main.jpg')
 * @returns URL of the uploaded file or null on error
 */
export const uploadProductImage = async (
  file: File,
  path: string
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_PRODUCT_IMAGES)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: true, // Override existing files
      });

    if (error) {
      console.error("Error uploading file:", error);
      return null;
    }

    // Get public URL for the file
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_PRODUCT_IMAGES).getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error("Error in upload process:", error);
    return null;
  }
};

/**
 * Get a list of files in a specific product folder
 * @param productId ID of the product
 * @returns Array of file objects or empty array on error
 */
export const getProductImages = async (productId: string) => {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_PRODUCT_IMAGES)
      .list(`product-${productId}`);

    if (error) {
      console.error("Error fetching product images:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetch process:", error);
    return [];
  }
};

/**
 * Delete a product image
 * @param path Path of the file to delete
 * @returns Boolean indicating success
 */
export const deleteProductImage = async (path: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_PRODUCT_IMAGES)
      .remove([path]);

    if (error) {
      console.error("Error deleting file:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in delete process:", error);
    return false;
  }
};

export { supabase, axiosInstance, BUCKET_PRODUCT_IMAGES };
