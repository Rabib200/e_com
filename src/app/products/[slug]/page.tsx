'use client';
import React from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

const products = [
  { id: 1, slug: "product-1", title: "Product 1", description: "Best quality cap for you", image: "/p1.webp", discount: "20%", discountPrice: "$20", price: "$25" },
  { id: 2, slug: "product-2", title: "Product 2", description: "Best quality hat for you", image: "/p2.webp", discount: "30%", discountPrice: "$30", price: "$40" },
  { id: 3, slug: "product-3", title: "Product 3", description: "Best quality beanie for you", image: "/p3.webp", discount: "40%", discountPrice: "$40", price: "$50" },
  { id: 4, slug: "product-4", title: "Product 4", description: "Best quality scarf for you", image: "/p4.webp", price: "$15" },
  // Add more products as needed
];

export default function ProductDetails() {
  const { slug } = useParams();

  if (!slug) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return <div className="text-center py-10">Product not found</div>;
  }

  return (
    <main className="p-8 mt-24 flex justify-center"> {/* Added mt-24 to account for the fixed navigation bar */}
      <Card className="max-w-2xl w-full p-6 shadow-md">
        <CardContent className="space-y-4">
          <div className="w-full h-80 relative rounded-lg overflow-hidden">
            <Image src={product.image} alt={product.title} fill style={{ objectFit: "cover" }} priority />
          </div>
          <div className="flex items-center justify-between">
            <CardTitle>{product.title}</CardTitle>
            {product.discount && <div className="badge badge-destructive">{product.discount} OFF</div>}
          </div>
          <div className="flex items-center space-x-2 text-lg font-semibold">
            {product.discountPrice ? (
              <>
                <span className="text-red-500">{product.discountPrice}</span>
                <span className="line-through text-gray-500">{product.price}</span>
              </>
            ) : (
              <span className="text-gray-500">{product.price}</span>
            )}
          </div>
          <CardDescription>{product.description}</CardDescription>
          <Separator />
          <Button className="w-full">Add to Cart</Button>
        </CardContent>
      </Card>
    </main>
  );
}