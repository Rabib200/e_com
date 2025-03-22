'use client'; 
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CartItem } from "@/lib/types";

const BillingPage = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState({
    fullName: "",
    streetAddress: "",
    city: "",
    phone: "",
    email: ""
  });

  useEffect(() => {
    try {
      const savedCart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
      if (Array.isArray(savedCart)) {
        setCart(savedCart);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      setCart([]);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('-', '')]: value
    }));
  };

  // Convert price string to number if needed
  const getNumericPrice = (price: string | number): number => {
    if (typeof price === 'string') {
      // Remove currency symbol and convert to number
      return parseFloat(price.replace(/[^0-9.-]+/g, ''));
    }
    return typeof price === 'number' ? price : 0;
  };

  const calculateItemTotal = (item: CartItem): number => {
    const price = getNumericPrice(item.price);
    const discountPrice = item.discountPrice !== undefined ? getNumericPrice(item.discountPrice) : undefined;
    const effectivePrice = discountPrice !== undefined ? discountPrice : price;
    return effectivePrice * item.quantity;
  };

  const calculateSubtotal = (): number => {
    return cart.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const formatCurrency = (amount: number): string => {
    return amount.toFixed(2);
  };

  const handlePlaceOrder = () => {
    // Validate form
    if (!formData.fullName || !formData.streetAddress || !formData.city || !formData.phone || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }

    // Process order
    const order = {
      customer: formData,
      items: cart,
      subtotal: calculateSubtotal(),
      total: calculateSubtotal(),
      orderDate: new Date().toISOString()
    };

    console.log("Order placed:", order);
    
    // Here you would typically send this to your backend
    alert("Order placed successfully!");
    
    // Clear cart
    localStorage.removeItem("cart");
    setCart([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-24">
      <h2 className="text-2xl font-bold mb-4">Billing Details</h2>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div>
          <Label htmlFor="full-name">Full Name *</Label>
          <Input 
            id="full-name" 
            placeholder="Enter your full name" 
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="street-address">Street Address *</Label>
          <Input 
            id="street-address" 
            placeholder="House number and street name" 
            value={formData.streetAddress}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="city">Town / City *</Label>
          <Input 
            id="city" 
            placeholder="Enter your city" 
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input 
            id="phone" 
            placeholder="Enter your phone number" 
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Enter your email" 
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Your Order</h2>
      <Card className="mb-6">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.length > 0 ? (
                cart.map((item) => {
                  const unitPrice = item.discountPrice !== undefined ? 
                    getNumericPrice(item.discountPrice) : 
                    getNumericPrice(item.price);
                  const itemTotal = calculateItemTotal(item);
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.title} {item.size && `(${item.size})`}</TableCell>
                      <TableCell>${formatCurrency(unitPrice)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">${formatCurrency(itemTotal)}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">Your cart is empty</TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell colSpan={3} className="font-bold">Subtotal</TableCell>
                <TableCell className="text-right">${formatCurrency(calculateSubtotal())}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="font-bold">Shipping</TableCell>
                <TableCell className="text-right">Free</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="font-bold text-lg">Total</TableCell>
                <TableCell className="text-right font-bold text-lg">${formatCurrency(calculateSubtotal())}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="p-4 border rounded-md mb-4">
        <p>Cash on delivery. Please contact us if you require assistance or wish to make alternate arrangements.</p>
      </div>

      <Button className="w-full bg-amber-600 hover:bg-amber-700" onClick={handlePlaceOrder}>
        Place Order
      </Button>
    </div>
  );
};

export default BillingPage;
