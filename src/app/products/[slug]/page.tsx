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
  discount?: number; // Now a float
  discount_type?: string; // New field: "percentage" or "fixed" or other types
  discountPrice?: number;
  price: number;
  sizes: string[];
  status: ProductStatus;
  inStock?: boolean; // Ensure this property exists
}

interface SizeAvailability {
  size: string;
  stock: number;
  product_id: UUID;
  color?: string; // Optional color property
}

export default function ProductDetails() {
  const router = useRouter();
  const params = useParams() || {};
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : '';
  const [product, setProduct] = useState<Product>();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [sizeAvailability, setSizeAvailability] = useState<SizeAvailability[]>([]);
  const [isLoadingSizes, setIsLoadingSizes] = useState(true);
  const [availableColors, setAvailableColors] = useState<string[]>([]);

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

  // Function to update available colors based on selected size
  const updateAvailableColorsForSize = (size: string) => {
    if (!size || !sizeAvailability.length) {
      setAvailableColors([]);
      return;
    }
    
    // Find all colors available for this size with stock > 0
    const colorsForSize = sizeAvailability
      .filter((item: SizeAvailability) => 
        item.size === size && 
        item.color && 
        item.stock > 0
      )
      .map((item: SizeAvailability) => item.color as string)
      .filter((color: string | undefined): color is string => Boolean(color));
    
    // Remove duplicates
    const uniqueColors = [...new Set(colorsForSize)];
    setAvailableColors(uniqueColors as string[]);
    
    // Reset selected color if current selection is not available for this size
    if (uniqueColors.length > 0) {
      if (!uniqueColors.includes(selectedColor)) {
        setSelectedColor(""); // Don't auto-select a color
      }
    } else {
      setSelectedColor("");
    }
  };

  // Fetch product by slug using Axios
  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setIsLoadingSizes(true);

      try {
        // Get product data first with isAvailable=eq.true filter
        const { data } = await axiosInstance.get(
          `/products?slug=eq.${slug}&isAvailable=eq.true&select=*`
        );
        
        if (data.length > 0) {
          const productData = data[0];
          setProduct(productData); // Set product data
          
          // Now fetch sizes using our dedicated API endpoint
          try {
            const sizesResponse = await fetch(`/api/sizes/${productData.id}`);
            const sizesData = await sizesResponse.json();
            
            if (sizesResponse.ok && sizesData.success) {
              setSizeAvailability(sizesData.sizes);
              
              // Set the first size with available stock as the default selected size
              const availableSize = sizesData.sizes.find((item: SizeAvailability) => item.stock > 0);
              if (availableSize) {
                // Set selected size
                setSelectedSize(availableSize.size);
                
                // Find available colors for this size
                const colorsForSelectedSize = sizesData.sizes
                  .filter((item: SizeAvailability) => 
                    item.size === availableSize.size && 
                    item.color && 
                    item.stock > 0
                  )
                  .map((item: SizeAvailability) => item.color as string)
                  .filter((color: string | undefined): color is string => Boolean(color));
                
                // Remove duplicates
                const uniqueColors = [...new Set(colorsForSelectedSize)];
                setAvailableColors(uniqueColors as string[]);
                
                // Do not set a default color - user must choose after size selection
                setSelectedColor("");
              } else if (sizesData.sizes.length > 0) {
                // If no sizes have stock, still select the first one to show it as out of stock
                setSelectedSize(sizesData.sizes[0].size);
                setAvailableColors([]);
                setSelectedColor("");
              }
            } else {
              console.error("Failed to fetch sizes:", sizesData.error);
              setSizeAvailability([]);
              setAvailableColors([]);
            }
          } catch (sizesError) {
            console.error("Error fetching sizes:", sizesError);
            setSizeAvailability([]);
          }
        } else {
          console.error("Product not found");
          setSizeAvailability([]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setSizeAvailability([]);
      } finally {
        setIsLoadingSizes(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // Function to check if a specific size and color combination is in stock
  const isSizeInStock = (size: string, color?: string): boolean => {
    const sizeData = sizeAvailability.find((item: SizeAvailability) => 
      item.size === size && (!color || item.color === color)
    );
    if (!sizeData) return true; // Default to true if size not found in table
    return sizeData.stock > 0;
  };

  // Check if product is out of stock based on status
  const isOutOfStock = React.useMemo(() => {
    if (!product) return true;
    return product.status === "Out_of_Stock";
  }, [product]);

  const addToCart = () => {
    if (!product || !selectedSize) return;
    
    // Check if colors are available for this size but none selected
    if (availableColors.length > 0 && !selectedColor) {
      toast.error("Please select a color", {
        description: "You need to select a color for this item.",
        duration: 3000
      });
      return;
    }
    
    // Check if the selected size and color combination is in stock
    const isSizeAvailable = isSizeInStock(selectedSize, selectedColor);
    if (!isSizeAvailable || isOutOfStock) {
      toast.error("This item is currently out of stock", {
        description: "Please select a different size or color, or check back later.",
        duration: 3000
      });
      return;
    }

    // Get size stock quantity
    const sizeData = sizeAvailability.find((item: SizeAvailability) => 
      item.size === selectedSize && (!selectedColor || item.color === selectedColor)
    );
    const stockQuantity = sizeData?.stock || 0;
    
    // Check existing cart items to prevent over-ordering
    const cartItemId = selectedColor 
      ? `${product.id}-${selectedSize}-${selectedColor}`
      : `${product.id}-${selectedSize}`;
    const existingItem = cart.find((item: CartItem) => item.id === cartItemId);
    const currentQuantityInCart = existingItem?.quantity || 0;
    
    // Check if adding another item would exceed available stock
    if (currentQuantityInCart >= stockQuantity) {
      toast.error("Maximum available quantity reached", {
        description: `Sorry, only ${stockQuantity} item(s) available in this size.`,
        duration: 3000
      });
      return;
    }

    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map((item: CartItem) =>
        item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          ...product,
          id: cartItemId,
          size: selectedSize,
          color: selectedColor || undefined, // Include color if selected
          quantity: 1,
        },
      ];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    
    // Enhanced toast with action button
    const itemDescription = selectedColor 
      ? `${product.title} (${selectedSize}, ${selectedColor})` 
      : `${product.title} (${selectedSize})`;
      
    toast.success("Product added to cart", {
      description: `${itemDescription} added to your shopping cart.`,
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
    <div className="flex justify-center items-start w-full px-4 sm:px-6 mt-20 sm:mt-24 mb-16">
      <Card className={`max-w-6xl w-full p-3 sm:p-4 shadow-md ${isOutOfStock ? 'opacity-90' : ''}`}>
        <CardContent className="p-2 sm:p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Left Column - Product Images */}
            <div className="w-full">
              {/* Product Image Carousel */}
              <div className="w-full relative mb-4">
                <Carousel className="w-full">
                  <CarouselContent>
                    {product.image.map((img: string, index: number) => (
                      <CarouselItem key={index}>
                        <div className="aspect-square relative rounded-lg overflow-hidden">
                          <Image
                            src={img}
                            alt={`${product.title} - Image ${index + 1}`}
                            width={600}
                            height={600}
                            sizes="(max-width: 768px) 100vw, 40vw"
                            className={`w-full h-full object-contain ${isOutOfStock ? "opacity-80 grayscale-[30%]" : ""}`}
                            priority={index === 0}
                          />
                          
                          {/* Overlay "Out of Stock" label on the image */}
                          {isOutOfStock && index === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black bg-opacity-70 text-white px-3 py-1.5 rounded-md text-base font-bold transform rotate-[-15deg] shadow-lg">
                                Out of Stock
                              </div>
                            </div>
                          )}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2 h-7 w-7" />
                  <CarouselNext className="right-2 h-7 w-7" />
                </Carousel>
                
                {/* Thumbnail Navigation (visible on larger screens) */}
                {product.image.length > 1 && (
                  <div className="hidden sm:flex mt-3 space-x-1.5 justify-center">
                    {product.image.map((img: string, index: number) => (
                      <div 
                        key={`thumb-${index}`}
                        className={`cursor-pointer w-12 h-12 relative rounded-md overflow-hidden border-2 transition-all ${
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
                          width={100}
                          height={100}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Column - Product Info */}
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg sm:text-xl">{product.title}</CardTitle>
                <div className="flex items-center gap-2">
                  {product.discount && product.discount > 0 && (
                    <div className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                      {product.discount_type === 'flat' 
                        ? `৳${product.discount} OFF` 
                        : `${product.discount.toFixed(0)}% OFF`}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-base sm:text-lg font-semibold">
                {product.discountPrice ? (
                  <>
                    <span className="text-red-500">৳{product.discountPrice}</span>
                    {product.price !== product.discountPrice && (
                      <span className="line-through text-gray-500 text-sm sm:text-base">
                        ৳{product.price}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-gray-700">৳{product.price}</span>
                )}
              </div>
              
              <CardDescription className="text-xs sm:text-sm py-1 whitespace-pre-line">
                {product.description}
              </CardDescription>

              {/* Stock Status */}
              <div className="py-1">
                <p className={`text-xs sm:text-sm font-medium ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                  {isOutOfStock ? 'Currently Out of Stock' : 'In Stock'}
                </p>
              </div>

              {/* Size Selection */}
              <div className="space-y-1 py-1">
                <h3 className="text-sm font-medium">Select Size</h3>
                {isLoadingSizes ? (
                  <div className="py-1 text-xs text-gray-500">Loading size availability...</div>
                ) : sizeAvailability.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {/* Show all available sizes without filtering by color */}
                    {Array.from(new Set(sizeAvailability.map(item => item.size))).map((size) => {
                      // Check if any variant of this size has stock
                      const inStock = sizeAvailability.some(
                        (item: SizeAvailability) => item.size === size && item.stock > 0
                      );
                        
                      return (
                        <Button
                          key={size}
                          variant={selectedSize === size ? "default" : "outline"}
                          className={`px-2 py-0.5 sm:px-3 sm:py-1 text-xs ${
                            selectedSize === size
                              ? "bg-amber-600 text-white hover:bg-amber-700"
                              : inStock 
                                ? "hover:bg-gray-100" 
                                : "opacity-60 cursor-not-allowed bg-gray-100"
                          }`}
                          onClick={() => {
                            if (!isOutOfStock && inStock) {
                              setSelectedSize(size);
                              // Update available colors for this size
                              updateAvailableColorsForSize(size);
                            }
                          }}
                          disabled={isOutOfStock || !inStock}
                        >
                          {size}
                        </Button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-1 text-xs text-gray-500">No sizes available for this product</div>
                )}
              </div>
              
              {/* Color Selection - Only display after a size is selected */}
              {selectedSize && (
                <div className="space-y-1 py-1">
                  <h3 className="text-sm font-medium">Select Color</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {availableColors.length > 0 ? (
                      availableColors.map((color) => {
                        const isSelected = selectedColor === color;
                        // Check if this color is available for the selected size
                        const isInStock = sizeAvailability.some((item) => 
                          item.size === selectedSize && 
                          item.color === color && 
                          item.stock > 0
                        );
                        
                        return (
                          <Button
                            key={color}
                            variant={isSelected ? "default" : "outline"}
                            className={`px-2 py-0.5 sm:px-3 sm:py-1 text-xs flex items-center gap-1 ${
                              isSelected
                                ? "bg-amber-600 text-white hover:bg-amber-700"
                                : isInStock
                                  ? "hover:bg-gray-100"
                                  : "opacity-60 cursor-not-allowed bg-gray-100"
                            }`}
                            onClick={() => !isOutOfStock && isInStock && setSelectedColor(color)}
                            disabled={isOutOfStock || !isInStock}
                          >
                            {color}
                            {isSelected && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </Button>
                        );
                      })
                    ) : (
                      <div className="py-1 text-xs text-gray-500">No colors available for this size</div>
                    )}
                  </div>
                </div>
              )}
              
              <Separator className="my-3" />
              
              <Button 
                className={`w-full py-2 ${isOutOfStock 
                  ? "bg-gray-400 hover:bg-gray-400" 
                  : "bg-amber-600 hover:bg-amber-700"} text-white font-medium`} 
                onClick={addToCart}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
