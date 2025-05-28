'use client';
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CartItem } from "@/lib/types";
import { axiosInstance } from "@/lib/supabase";
import { toast } from "sonner";

const CartPage = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [stockStatus, setStockStatus] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    if (isClient) {
      try {
        const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (Array.isArray(savedCart)) {
          setCart(savedCart);
        } else {
          setCart([]);
          console.error("Cart data is not an array:", savedCart);
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        setCart([]);
      }
    }
  }, [isClient]);

  // Check stock status for each product in cart
  useEffect(() => {
    const checkStockStatus = async () => {
      if (cart.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        // Extract unique product slugs from cart
        const slugs = [...new Set(cart.map(item => item.slug))];
        
        // Fetch stock status for all products in a single request
        const { data } = await axiosInstance.get(
          `/products?slug=in.(${slugs.join(',')})&select=slug,status,inStock`
        );
        
        const statusMap: Record<string, boolean> = {};
        
        // Process the response
        if (Array.isArray(data)) {
          data.forEach(product => {
            // Only check for the specific "Out_of_Stock" status
            const isInStock = product.status !== "Out_of_Stock";
            statusMap[product.slug] = isInStock;
          });
        }
        
        setStockStatus(statusMap);
      } catch (error) {
        console.error("Error checking stock status:", error);
        // If there's an error, we'll assume all products are in stock
        const defaultStatus: Record<string, boolean> = {};
        cart.forEach(item => {
          defaultStatus[item.slug] = true;
        });
        setStockStatus(defaultStatus);
      } finally {
        setIsLoading(false);
      }
    };

    if (isClient && cart.length > 0) {
      checkStockStatus();
    } else {
      setIsLoading(false);
    }
  }, [cart, isClient]);

  // Sync cart state with localStorage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isClient]);

  const isItemInStock = (item: CartItem) => {
    return stockStatus[item.slug] !== false;
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) => 
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Ensure localStorage updates immediately
      return updatedCart;
    });
  };

  const handleBillingOrder = () => {
    // Check if any items in cart are out of stock
    const outOfStockItems = cart.filter(item => !isItemInStock(item));
    
    if (outOfStockItems.length > 0) {
      toast.error("Some items in your cart are out of stock", {
        description: "Please remove out-of-stock items before proceeding to checkout.",
        duration: 5000,
      });
      return;
    }
    
    console.log("Proceeding to billing");
    router.push("/billing");
  };

  const calculateSubtotal = () => {
    return cart.reduce((acc, item) => {
      const price = item.discountPrice ? item.discountPrice : (typeof item.price === "number" ? item.price : parseFloat(item.price as string));
      return acc + price * (item.quantity || 1);
    }, 0);
  };
  
  const subtotal = calculateSubtotal();

  if (!isClient || isLoading) {
    return (
      <div className="container mx-auto p-6 mt-24">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        <div className="bg-white p-4 shadow-md rounded-lg">
          <p className="text-center py-4">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 mt-32 sm:mt-36">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      <div className="bg-white p-4 shadow-md rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.length > 0 ? cart.map((item) => {
              const inStock = isItemInStock(item);
              return (
                <TableRow key={item.id} className={!inStock ? "bg-red-50" : ""}>
                  <TableCell>
                    <div className="w-16 h-16 relative">
                      <Image 
                        src={item.image[0]} 
                        alt={item.title} 
                        fill 
                        style={{ objectFit: "cover" }} 
                        className={!inStock ? "opacity-60" : ""}
                      />
                      {!inStock && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-red-600 text-white text-xs px-1 py-0.5 rounded rotate-[-10deg]">Out of Stock</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.title}
                    {!inStock && (
                      <p className="text-red-600 text-xs mt-1">This item is currently out of stock</p>
                    )}
                  </TableCell>
                  <TableCell>{item.size || "N/A"}</TableCell>
                  <TableCell>{item.color || "N/A"}</TableCell>
                  <TableCell>৳{item.discountPrice ? item.discountPrice.toFixed(2) : item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <input
                      type="number"
                      className={`w-16 border p-1 rounded-md text-center ${!inStock ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      value={item.quantity || 1}
                      min={1}
                      onChange={(e) => inStock && updateQuantity(item.id, parseInt(e.target.value))}
                      disabled={!inStock}
                    />
                  </TableCell>
                  <TableCell>৳{item.discountPrice ? (item.discountPrice * (item.quantity || 1)).toFixed(2) : (item.price * (item.quantity || 1)).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button variant="destructive" onClick={() => removeFromCart(item.id)}>
                      {!inStock ? "Remove (Out of Stock)" : "Remove"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            }) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">Your cart is empty</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {cart.length > 0 && (
        <div className="mt-6 flex justify-end">
          <Card className="w-full max-w-sm p-4 shadow-md">
            <CardContent>
              <h2 className="text-lg font-semibold mb-2">Cart Totals</h2>
              <div className="flex justify-between mb-1">
                <span>Subtotal:</span>
                <span>৳{subtotal.toFixed(2)}</span>
              </div>
{/* 
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{subtotal.toFixed(2)}</span>
              </div> */}
              
              {/* Show warning if out-of-stock items exist */}
              {cart.some((item: CartItem) => !isItemInStock(item)) && (
                <div className="mt-3 p-2 border border-red-300 bg-red-50 rounded-md text-sm text-red-600">
                  <p className="font-medium">Warning: Out of Stock Items</p>
                  <p>Please remove out-of-stock items before proceeding to checkout.</p>
                </div>
              )}
              
              <Button 
                className={`mt-4 w-full ${cart.some((item: CartItem) => !isItemInStock(item)) 
                  ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                  : "bg-amber-600 hover:bg-amber-700"}`} 
                onClick={handleBillingOrder}
                disabled={cart.some((item: CartItem) => !isItemInStock(item))}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div> 
  );
};

export default CartPage;