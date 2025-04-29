"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { CartItem, ProductStatus } from "@/lib/types";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/supabase";
import { UUID } from "crypto";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Product {
  id: UUID;
  slug: string;
  title: string;
  description: string;
  image: string[];
  discount?: number;
  discountPrice?: number;
  price: number;
  sizes: string[];
  status: ProductStatus;
  inStock?: boolean; // Ensure this property exists
}

export default function ProductDetails() {
  const router = useRouter();
  const { slug } = useParams();
  const [product, setProduct] = useState<Product>();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      // Ensure cart is always an array
      setCart(Array.isArray(storedCart) ? storedCart : []);
    } catch (error) {
      console.error("Error parsing cart from localStorage:", error);
      setCart([]);
    }
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

  // Check if product is out of stock based on status
  const isOutOfStock = React.useMemo(() => {
    if (!product) return true;
    return product.status === "Out_of_Stock";
  }, [product]);

  const addToCart = () => {
    if (!product || !selectedSize || isOutOfStock) return;

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
    
    // Enhanced toast with action button
    toast("Product added to cart", {
      description: `${product.title} (${selectedSize}) added to your shopping cart.`,
      action: {
        label: "View Cart",
        onClick: () => router.push("/cart")
      },
      duration: 5000 // Show for 5 seconds
    });
  };

  if (!product) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <main className="p-4 sm:p-8 mt-24 flex justify-center">
      <Card className={`max-w-4xl w-full p-3 sm:p-6 shadow-md ${isOutOfStock ? 'opacity-90' : ''}`}>
        <CardContent className="space-y-6">
          {/* Product Image Carousel */}
          <div className="w-full relative mb-4">
            <Carousel className="w-full">
              <CarouselContent>
                {product.image.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-square sm:aspect-[4/3] md:aspect-[16/9] relative rounded-lg overflow-hidden">
                      <Image
                        src={img}
                        alt={`${product.title} - Image ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: "cover" }}
                        priority={index === 0}
                        className={isOutOfStock ? "opacity-80 grayscale-[30%]" : ""}
                      />
                      
                      {/* Overlay "Out of Stock" label on the image */}
                      {isOutOfStock && index === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-md text-lg font-bold transform rotate-[-15deg] shadow-lg">
                            Out of Stock
                          </div>
                        </div>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 h-8 w-8" />
              <CarouselNext className="right-2 h-8 w-8" />
            </Carousel>
            
            {/* Thumbnail Navigation (visible on larger screens) */}
            {product.image.length > 1 && (
              <div className="hidden sm:flex mt-4 space-x-2 justify-center">
                {product.image.map((img, index) => (
                  <div 
                    key={`thumb-${index}`}
                    className={`cursor-pointer w-16 h-16 relative rounded-md overflow-hidden border-2 transition-all ${
                      currentImageIndex === index 
                        ? "border-amber-600 opacity-100" 
                        : "border-transparent opacity-70 hover:opacity-100"
                    } ${isOutOfStock ? "grayscale-[30%]" : ""}`}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      // Find and click the carousel navigation button
                      const buttons = document.querySelectorAll('[data-carousel-button]');
                      if (buttons && buttons.length >= 2) {
                        // This is a workaround - in a real implementation, you would use a ref to control the carousel
                        const diff = index - currentImageIndex;
                        const clickCount = Math.abs(diff);
                        const buttonIndex = diff > 0 ? 1 : 0; // 0 for prev, 1 for next
                        
                        for (let i = 0; i < clickCount; i++) {
                          setTimeout(() => {
                            (buttons[buttonIndex] as HTMLButtonElement).click();
                          }, i * 100);
                        }
                      }
                    }}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl sm:text-2xl">{product.title}</CardTitle>
              <div className="flex items-center gap-2">
                {isOutOfStock && (
                  <div className="px-2 py-1 bg-red-600 text-white text-xs sm:text-sm font-bold rounded">
                    Out of Stock
                  </div>
                )}
                {product.discount && product.discount > 0 && (
                  <div className="px-2 py-1 bg-red-500 text-white text-xs sm:text-sm font-bold rounded">
                    {product.discount}% OFF
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-lg sm:text-xl font-semibold">
              {product.discountPrice ? (
                <>
                  <span className="text-red-500">৳{product.discountPrice}</span>
                  <span className="line-through text-gray-500">
                    ৳{product.price}
                  </span>
                </>
              ) : (
                <span className="text-gray-700">৳{product.price}</span>
              )}
            </div>
            
            <CardDescription className="text-sm sm:text-base py-2">
              {product.description}
            </CardDescription>

            {/* Stock Status */}
            <div className="py-2">
              <p className={`text-sm font-medium ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                {isOutOfStock ? 'Currently Out of Stock' : 'In Stock'}
              </p>
            </div>

            {/* Size Selection */}
            <div className="space-y-2 py-2">
              <h3 className="font-medium">Select Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes &&
                  product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      className={`px-3 py-1 sm:px-4 sm:py-2 text-sm ${
                        selectedSize === size
                          ? "bg-amber-600 text-white hover:bg-amber-700"
                          : "hover:bg-gray-100"
                      } ${isOutOfStock ? "opacity-60 cursor-not-allowed" : ""}`}
                      onClick={() => !isOutOfStock && setSelectedSize(size)}
                      disabled={isOutOfStock}
                    >
                      {size}
                    </Button>
                  ))}
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <Button 
              className={`w-full py-2.5 ${isOutOfStock 
                ? "bg-gray-400 hover:bg-gray-400" 
                : "bg-amber-600 hover:bg-amber-700"} text-white font-medium`} 
              onClick={addToCart}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
