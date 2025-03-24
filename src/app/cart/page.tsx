'use client';
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CartItem } from "@/lib/types";

const CartPage = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);
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

  // Sync cart state with localStorage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isClient]);

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

  if (!isClient) {
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
    <div className="container mx-auto p-6 mt-24">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      <div className="bg-white p-4 shadow-md rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.length > 0 ? cart.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="w-16 h-16 relative">
                    <Image src={item.image} alt={item.title} fill style={{ objectFit: "cover" }} />
                  </div>
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.size || "N/A"}</TableCell>
                <TableCell>${item.discountPrice ? item.discountPrice.toFixed(2) : item.price.toFixed(2)}</TableCell>
                <TableCell>
                  <input
                    type="number"
                    className="w-16 border p-1 rounded-md text-center"
                    value={item.quantity || 1}
                    min={1}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                  />
                </TableCell>
                <TableCell>${item.discountPrice ? (item.discountPrice * (item.quantity)) : (item.price * (item.quantity || 1)).toFixed(2)}</TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => removeFromCart(item.id)}>Remove</Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">Your cart is empty</TableCell>
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
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Shipping:</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <Button className="mt-4 w-full bg-amber-600 hover:bg-amber-700" onClick={handleBillingOrder}>
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