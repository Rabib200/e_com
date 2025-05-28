'use client'; 
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CartItem } from "@/lib/types";
import { useRouter } from "next/navigation";
import { ErrorWithResponse } from "@/lib/errorTemplate";
import { Copy, Check, CreditCard, ShoppingBag } from "lucide-react";

interface ShippingOption {
  id: string;
  label: string;
  price: number;
}

const shippingOptions: ShippingOption[] = [
  { id: "inside_dhaka", label: "Inside Dhaka", price: 60 },
  { id: "outside_dhaka", label: "Outside Dhaka", price: 120 }
];

const BillingPage = () => {
  const router = useRouter();
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState({
    fullName: "",
    streetAddress: "",
    city: "",
    phone: "",
    email: "",
    shippingOption: "inside_dhaka"
  });
  
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption>(shippingOptions[0]);
  const [copying, setCopying] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [transactionIdError, setTransactionIdError] = useState("");

  useEffect(() => {
    try {
      const savedCart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
      if (Array.isArray(savedCart)) {
        setCart(savedCart);
      } else {
        // If cart isn't an array, initialize it as empty array
        console.error("Cart from localStorage is not an array");
        setCart([]);
      }
      
      const savedShippingOption = localStorage.getItem("shippingOption");
      if (savedShippingOption) {
        try {
          const parsedOption = JSON.parse(savedShippingOption);
          const option = shippingOptions.find(opt => opt.id === parsedOption.id);
          if (option) {
            setSelectedShipping(option);
            setFormData(prev => ({ ...prev, shippingOption: option.id }));
          }
        } catch (error) {
          console.error("Error parsing saved shipping option:", error);
        }
      }
    } catch (error) {
      console.error("Error loading cart or shipping options:", error);
      setCart([]);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
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
  
  const handleShippingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const shippingId = e.target.value;
    const option = shippingOptions.find(opt => opt.id === shippingId) || shippingOptions[0];
    
    setSelectedShipping(option);
    setFormData(prev => ({ ...prev, shippingOption: option.id }));
    
    localStorage.setItem("shippingOption", JSON.stringify(option));
  };

  const getNumericPrice = (price: string | number | undefined): number => {
    if (price === undefined) {
      return 0;
    }
    
    if (typeof price === 'string') {
      if (price.startsWith('$')) {
        return parseFloat(price.substring(1));
      }
      return parseFloat(price.replace(/[^0-9.-]+/g, '')) || 0;
    }
    
    return typeof price === 'number' ? price : 0;
  };

  const calculateItemTotal = (item: CartItem): number => {
    const price = getNumericPrice(item.price);
    const discountPrice = item.discountPrice !== null 
      ? getNumericPrice(item.discountPrice) 
      : null;
      
    const effectivePrice = discountPrice !== null ? discountPrice : price;
    
    return (effectivePrice || 0) * (item.quantity || 1);
  };

  const calculateSubtotal = (): number => {
    return cart.reduce((total, item) => total + calculateItemTotal(item), 0);
  };
  
  const calculateTotal = (): number => {
    return calculateSubtotal() + selectedShipping.price;
  };

  const formatCurrency = (amount: number): string => {
    return amount.toFixed(2);
  };

  const handleTransactionIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransactionId(e.target.value);
    if (e.target.value.trim() === "") {
      setTransactionIdError("Transaction ID is required after payment");
    } else {
      setTransactionIdError("");
    }
  };

  const handlePlaceOrder = async () => {
    // Form validation - remove email from required fields
    if (!formData.fullName || !formData.streetAddress || !formData.city || !formData.phone) {
      alert("Please fill in all required fields");
      return;
    }

    // Transaction ID validation
    if (!transactionId.trim()) {
      setTransactionIdError("Please enter your bKash Transaction ID");
      return;
    }

    // Save customer info to localStorage
    localStorage.setItem("customerInfo", JSON.stringify({
      ...formData,
      shippingOption: selectedShipping,
      transactionId: transactionId.trim()
    }));

    try {
      // Create the order directly with the transaction ID
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          paymentDetails: {
            amount: calculateTotal(),
            transactionStatus: "Completed",
            transactionId: transactionId.trim(),
            paymentMethod: "bkash",
            currency: "BDT",
          },
          customerInfo: {
            fullName: formData.fullName,
            streetAddress: formData.streetAddress,
            city: formData.city,
            phone: formData.phone,
            email: formData.email
          },
          items: cart,
          orderDate: new Date().toISOString(),
          totalAmount: calculateTotal(),
          shipping: selectedShipping
        })
      });
      
      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || "Failed to create order");
      }
      
      const orderResult = await orderResponse.json();
      
      // Clear cart after successful order
      localStorage.removeItem("cart");
      
      // Redirect to success page
      router.push(`/order?orderId=${orderResult.orderId}`);
      
    } catch (error: unknown) {
      console.error("Order placement failed:", error);
      const typedError = error as ErrorWithResponse;
      alert(`Failed to place order: ${typedError.message}`);
    }
  };

  const isCartEmpty = cart.length === 0;

  const handleGoToProducts = () => {
    router.push('/');
  };

  const copyBkashNumber = () => {
    const bkashNumber = "01953965548";
    navigator.clipboard.writeText(bkashNumber)
      .then(() => {
        setCopying(true);
        setTimeout(() => setCopying(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 mt-32 sm:mt-36">
      {!isCartEmpty && (
        <div className="md:hidden mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Order Summary</h2>
            <span className="text-lg font-semibold">৳{formatCurrency(calculateTotal())}</span>
          </div>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="grid grid-cols-[1fr_auto] gap-2 items-start py-1 border-b border-gray-100">
                    <div className="break-words">
                      <div className="flex items-start">
                        <ShoppingBag className="h-4 w-4 mr-2 text-gray-500 mt-1 flex-shrink-0" />
                        <span className="text-sm">
                          {item.title} {item.size && `(${item.size}${item.color ? `, ${item.color}` : ''})`}
                          <span className="block text-xs text-gray-500">x{item.quantity}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-sm font-medium whitespace-nowrap">
                      ৳{formatCurrency(calculateItemTotal(item))}
                    </div>
                  </div>
                ))}
                
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center py-1">
                  <div className="text-sm">Subtotal</div>
                  <div className="text-right text-sm whitespace-nowrap">৳{formatCurrency(calculateSubtotal())}</div>
                </div>
                
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center py-1">
                  <div className="text-sm">Shipping ({selectedShipping.label})</div>
                  <div className="text-right text-sm whitespace-nowrap">৳{selectedShipping.price}</div>
                </div>
                
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center py-1 pt-2 border-t border-gray-200">
                  <div className="font-bold">Total</div>
                  <div className="text-right whitespace-nowrap font-bold">৳{formatCurrency(calculateTotal())}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-7/12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Billing Details</h2>
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
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email (optional)" 
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="shipping-option">Shipping Option *</Label>
              <select 
                id="shipping-option" 
                className="w-full p-2 border rounded-md"
                value={formData.shippingOption}
                onChange={handleShippingChange}
              >
                {shippingOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label} - ৳{option.price}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="w-full md:w-5/12">
          <div className="hidden md:block">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Your Order</h2>
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="w-full">
                  <div className="grid grid-cols-[1fr_auto] border-b pb-2 mb-2">
                    <div className="font-semibold">Product</div>
                    <div className="font-semibold text-right">Total</div>
                  </div>
                  
                  {cart.length > 0 ? (
                    <div className="space-y-3">
                      {cart.map((item) => {
                        const itemTotal = calculateItemTotal(item);
                        
                        return (
                          <div key={item.id} className="grid grid-cols-[1fr_auto] gap-4 items-start py-1 border-b border-gray-100">
                            <div className="break-words pr-2">
                              <span className="block">{item.title} {item.size && `(${item.size}${item.color ? `, ${item.color}` : ''})`}</span>
                              <span className="block text-xs text-gray-500">x{item.quantity}</span>
                            </div>
                            <div className="text-right whitespace-nowrap pl-4 font-medium">
                              ৳{formatCurrency(itemTotal)}
                            </div>
                          </div>
                        );
                      })}
                      
                      <div className="grid grid-cols-[1fr_auto] gap-4 items-center py-1">
                        <div className="font-medium">Subtotal</div>
                        <div className="text-right whitespace-nowrap">৳{formatCurrency(calculateSubtotal())}</div>
                      </div>
                      
                      <div className="grid grid-cols-[1fr_auto] gap-4 items-center py-1">
                        <div className="font-medium">Shipping ({selectedShipping.label})</div>
                        <div className="text-right whitespace-nowrap">৳{selectedShipping.price}</div>
                      </div>
                      
                      <div className="grid grid-cols-[1fr_auto] gap-4 items-center py-1 pt-2 border-t border-gray-200">
                        <div className="font-bold text-lg">Total</div>
                        <div className="text-right whitespace-nowrap font-bold text-lg">৳{formatCurrency(calculateTotal())}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">Your cart is empty</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="p-4 border rounded-md mb-4 border-amber-900 bg-amber-600 text-white">
            <p className="font-medium text-base sm:text-lg mb-2">To confirm your order please pay the shipping charge using bKash/Nagad/Rocket *SEND MONEY*</p>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold text-lg sm:text-xl">01953965548</p>
              <button 
                onClick={copyBkashNumber}
                className="p-1.5 sm:p-2 rounded-md bg-white/20 hover:bg-white/30 transition-colors flex items-center"
                aria-label="Copy bKash number"
              >
                {copying ? (
                  <>
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="text-xs sm:text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="text-xs sm:text-sm">Copy</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-4">
              <Label htmlFor="transaction-id" className="text-white text-sm sm:text-base">
               Transaction ID/ Phone Number *
              </Label>
              <div className="flex mt-1">
                <div className="relative flex-grow">
                  <CreditCard className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-800" />
                  <Input
                    id="transaction-id"
                    placeholder="Enter your Transaction ID/ Phone Number"
                    value={transactionId}
                    onChange={handleTransactionIdChange}
                    className="pl-8 bg-white/90 text-amber-900 placeholder:text-amber-700/60 border-amber-800"
                    required
                  />
                </div>
              </div>
              {transactionIdError && (
                <p className="text-xs text-amber-200 mt-1">{transactionIdError}</p>
              )}
              <p className="text-xs text-amber-200 mt-1">
                After making payment, enter the Transaction ID you received.
              </p>
            </div>
          </div>

          {isCartEmpty ? (
            <div className="text-center mb-6">
              <p className="text-base sm:text-lg text-red-600 mb-4">Your cart is empty. Please add items to place an order.</p>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                onClick={handleGoToProducts}
              >
                Browse Products
              </Button>
            </div>
          ) : (
            <Button 
              className="w-full py-2.5 sm:py-3 bg-amber-600 hover:bg-amber-700 text-base sm:text-lg" 
              onClick={handlePlaceOrder}
              disabled={!formData.fullName || !formData.streetAddress || !formData.city || !formData.phone || !transactionId.trim()}
            >
              Place Order
            </Button>
          )}
          
          {!isCartEmpty && (formData.fullName === '' || formData.streetAddress === '' || formData.city === '' || formData.phone === '' || !transactionId.trim()) && (
            <p className="text-xs sm:text-sm text-red-500 text-center mt-2">
              Please fill in all required fields including bKash Transaction ID to place your order
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
