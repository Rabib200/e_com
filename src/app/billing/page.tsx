'use client'; 
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CartItem } from "@/lib/types";
import { useRouter } from "next/navigation";

const BillingPage = () => {
  const router = useRouter();
  
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

  // Fix the handleInputChange function to properly map IDs to state properties
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    // Map the field IDs to state properties
    const fieldMappings: Record<string, string> = {
      'full-name': 'fullName',
      'street-address': 'streetAddress',
      'city': 'city',
      'phone': 'phone',
      'email': 'email'
    };
    
    const stateKey = fieldMappings[id] || id;
    
    setFormData(prev => ({
      ...prev,
      [stateKey]: value
    }));
  };

  const getNumericPrice = (price: string | number | undefined): number => {
    if (price === undefined) {
      return 0;
    }
    
    if (typeof price === 'string') {
      // If price is a string with $ symbol (e.g., "$10.99")
      if (price.startsWith('$')) {
        return parseFloat(price.substring(1));
      }
      // Handle other string formats
      return parseFloat(price.replace(/[^0-9.-]+/g, '')) || 0;
    }
    
    // If price is already a number
    return typeof price === 'number' ? price : 0;
  };

  const calculateItemTotal = (item: CartItem): number => {
    const price = getNumericPrice(item.price);
    const discountPrice = item.discountPrice !== null 
      ? getNumericPrice(item.discountPrice) 
      : null;
      
    // Use discount price if available, otherwise use regular price
    const effectivePrice = discountPrice !== null ? discountPrice : price;
    
    // Make sure effectivePrice and quantity are valid numbers
    return (effectivePrice || 0) * (item.quantity || 1);
  };

  const calculateSubtotal = (): number => {
    return cart.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const formatCurrency = (amount: number): string => {
    return amount.toFixed(2);
  };

  const handlePlaceOrder = async () => {
    // Validate form
    if (!formData.fullName || !formData.streetAddress || !formData.city || !formData.phone || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }

  

    try {
      // Step 1: Get bKash token
      const grantTokenResponse = await fetch("/api/bkash-getToken");
      if (!grantTokenResponse.ok) {
        throw new Error("Failed to get payment token");
      }
      const tokenData = await grantTokenResponse.json();
      console.log("Token data:", tokenData);
      
     // Step 2: Create payment with the token
      const createPaymentResponse = await fetch("/api/bkash-createPayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          accessToken: tokenData.id_token, // Use the correct token property based on your API response
          amount: calculateSubtotal().toString(),
          currency: "BDT",
          intent: "sale",
          merchantInvoiceNumber: `INV-${Date.now()}` // Generate a unique invoice number
        }),
      });
      
      if (!createPaymentResponse.ok) {
        throw new Error("Failed to create payment");
      }
      
      const paymentData = await createPaymentResponse.json();
      console.log("Payment created:", paymentData);
      
      // If the payment creation returns a URL to redirect to
      if (paymentData.bkashURL) {
        window.location.href = paymentData.bkashURL;
        return;
      }

      
      
    } catch (error: any) {
      console.error("Order placement failed:", error);
      alert(`Failed to place order: ${error.message}`);
    }
  };

  // Check if cart is empty
  const isCartEmpty = cart.length === 0;

  // Add navigation to handle going back to the products
  
  const handleGoToProducts = () => {
    router.push('/');
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
                  console.log(item);
                  // For display purposes, prefer discount price if available
                  const unitPrice = item.discountPrice !== null 
                    ? getNumericPrice(item.discountPrice) 
                    : getNumericPrice(item.price);
                    
                  const itemTotal = calculateItemTotal(item);
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.title} {item.size && `(${item.size})`}</TableCell>
                      <TableCell>${formatCurrency(unitPrice || 0)}</TableCell>
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

      <div className="p-4 border rounded-md mb-4 border-amber-900">
        <p>To Confirm your order please pay the shipping charge in bkash</p>
      </div>

      {isCartEmpty ? (
        <div className="text-center mb-6">
          <p className="text-lg text-red-600 mb-4">Your cart is empty. Please add items to place an order.</p>
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700" 
            onClick={handleGoToProducts}
          >
            Browse Products
          </Button>
        </div>
      ) : (
        <Button 
          className="w-full bg-amber-600 hover:bg-amber-700" 
          onClick={handlePlaceOrder}
          disabled={!formData.fullName || !formData.streetAddress || !formData.city || !formData.phone || !formData.email}
        >
          Place Order
        </Button>
      )}
      
      {!isCartEmpty && (formData.fullName === '' || formData.streetAddress === '' || formData.city === '' || formData.phone === '' || formData.email === '') && (
        <p className="text-sm text-red-500 text-center mt-2">
          Please fill in all required fields to place your order
        </p>
      )}
    </div>
  );
};

export default BillingPage;
