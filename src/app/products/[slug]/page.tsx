"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/lib/types";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/supabase";
import { UUID } from "crypto";

interface Product {
  id: UUID;
  slug: string;
  title: string;
  description: string;
  image: string;
  discount?: number;
  discountPrice?: number;
  price: number;
  sizes: string[];
}

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product>();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>("");

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  // Fetch product by slug using Axios
  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;

      try {
        const { data } = await axiosInstance.get(
          `/products?slug=eq.${slug}&select=*`
        );
        if (data.length > 0) {
          setProduct(data[0]); // Set first matching product
          if (data[0].sizes && data[0].sizes.length > 0) {
            setSelectedSize(data[0].sizes[0]); // Set default size
          }
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [slug]);

  const addToCart = () => {
    if (!product || !selectedSize) return;

    const cartItemId = `${product.id}-${selectedSize}`;
    const existingItem = cart.find((item) => item.id === cartItemId);

    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          ...product,
          id: cartItemId,
          size: selectedSize,
          quantity: 1,
        },
      ];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast("Product added to cart");
  };

  if (!product) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <main className="p-8 mt-24 flex justify-center">
      <Card className="max-w-2xl w-full p-6 shadow-md">
        <CardContent className="space-y-4">
          <div className="w-full h-80 relative rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.title}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
          <div className="flex items-center justify-between">
            <CardTitle>{product.title}</CardTitle>
            {product.discount && (
              <div className="badge badge-destructive">
                {product.discount}% OFF
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 text-lg font-semibold">
            {product.discountPrice ? (
              <>
                <span className="text-red-500">${product.discountPrice}</span>
                <span className="line-through text-gray-500">
                  ${product.price}
                </span>
              </>
            ) : (
              <span className="text-gray-500">${product.price}</span>
            )}
          </div>
          <CardDescription>{product.description}</CardDescription>

          {/* Size Selection */}
          <div className="space-y-2">
            <h3 className="font-medium">Select Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes &&
                product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    className={`px-4 py-2 ${
                      selectedSize === size
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
            </div>
          </div>
          <Separator />
          <Button className="w-full" onClick={addToCart}>
            Add to Cart
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
