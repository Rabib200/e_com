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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ShippingOption {
  id: string;
  label: string;
  price: number;
}

const shippingOptions: ShippingOption[] = [
  { id: "inside_dhaka", label: "Inside Dhaka", price: 60 },
  { id: "outside_dhaka", label: "Outside Dhaka", price: 120 }
];

interface PaymentMethod {
  id: string;
  label: string;
  number: string;
  backgroundColor: string;
  textColor: string;
}

const paymentMethods: PaymentMethod[] = [
  { 
    id: "bkash", 
    label: "bKash", 
    number: "01953965548",
    backgroundColor: "bg-pink-600",
    textColor: "text-white"
  },
  { 
    id: "nagad", 
    label: "Nagad", 
    number: "01953965548",
    backgroundColor: "bg-orange-500",
    textColor: "text-white"
  },
  { 
    id: "rocket", 
    label: "Rocket", 
    number: "01953965548",
    backgroundColor: "bg-purple-600",
    textColor: "text-white"
  }
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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [modalPhoneNumber, setModalPhoneNumber] = useState("");
  const [modalTransactionId, setModalTransactionId] = useState("");
  const [modalFieldError, setModalFieldError] = useState("");

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

    // Payment method validation
    if (!selectedPaymentMethod) {
      alert("Please select a payment method");
      return;
    }

    // Transaction ID validation
    if (!transactionId.trim()) {
      setTransactionIdError("Please enter your Transaction ID or Phone Number");
      return;
    }

    // Save customer info to localStorage
    localStorage.setItem("customerInfo", JSON.stringify({
      ...formData,
      shippingOption: selectedShipping,
      transactionId: transactionId.trim(),
      paymentMethod: selectedPaymentMethod
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
            paymentMethod: selectedPaymentMethod,
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

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method.id);
    setIsPaymentModalOpen(true);
    // Reset modal fields
    setModalPhoneNumber("");
    setModalTransactionId("");
    setModalFieldError("");
  };

  const handleModalConfirm = () => {
    // Validate that at least one field is filled
    if (!modalPhoneNumber.trim() && !modalTransactionId.trim()) {
      setModalFieldError("Please enter either your phone number or transaction ID");
      return;
    }

    // Update the main transactionId field with the provided data
    const finalValue = modalTransactionId.trim() || modalPhoneNumber.trim();
    setTransactionId(finalValue);
    
    // Close modal
    setIsPaymentModalOpen(false);
    setModalFieldError("");
  };

  const handleModalCancel = () => {
    setIsPaymentModalOpen(false);
    setSelectedPaymentMethod("");
    setModalPhoneNumber("");
    setModalTransactionId("");
    setModalFieldError("");
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

          <div className="space-y-4">
            {/* Payment Method Selection */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Select Payment Method</h3>
              <div className="grid grid-cols-1 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handlePaymentMethodSelect(method)}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                      selectedPaymentMethod === method.id
                        ? `${method.backgroundColor} ${method.textColor} border-transparent`
                        : `border-gray-300 hover:border-gray-400 bg-white text-gray-700`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          selectedPaymentMethod === method.id 
                            ? 'bg-white' 
                            : 'border-2 border-gray-400'
                        }`} />
                        <span className="font-medium text-lg">{method.label}</span>
                      </div>
                      <span className="text-sm opacity-90">{method.number}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Payment Method Details */}
            {selectedPaymentMethod && (
              <div className={`p-4 border rounded-md ${
                paymentMethods.find(m => m.id === selectedPaymentMethod)?.backgroundColor
              } ${
                paymentMethods.find(m => m.id === selectedPaymentMethod)?.textColor
              }`}>
                <p className="font-medium text-base sm:text-lg mb-2">
                  Complete your payment using {paymentMethods.find(m => m.id === selectedPaymentMethod)?.label} *SEND MONEY*
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold text-lg sm:text-xl">
                    {paymentMethods.find(m => m.id === selectedPaymentMethod)?.number}
                  </p>
                  <button 
                    onClick={copyBkashNumber}
                    className="p-1.5 sm:p-2 rounded-md bg-white/20 hover:bg-white/30 transition-colors flex items-center"
                    aria-label="Copy payment number"
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
                   Transaction ID / Phone Number *
                  </Label>
                  <div className="flex mt-1">
                    <div className="relative flex-grow">
                      <CreditCard className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
                      <Input
                        id="transaction-id"
                        placeholder="Enter your Transaction ID or Phone Number"
                        value={transactionId}
                        onChange={handleTransactionIdChange}
                        className="pl-8 bg-white/90 text-gray-800 placeholder:text-gray-600 border-gray-300"
                        required
                      />
                    </div>
                  </div>
                  {transactionIdError && (
                    <p className="text-xs text-white/80 mt-1">{transactionIdError}</p>
                  )}
                  <p className="text-xs text-white/80 mt-1">
                    After making payment, enter the Transaction ID you received or your phone number.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Payment Modal */}
          <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {selectedPaymentMethod && 
                    `Complete ${paymentMethods.find(m => m.id === selectedPaymentMethod)?.label} Payment`
                  }
                </DialogTitle>
                <DialogDescription>
                  Please send money to the number below and enter your transaction details.
                </DialogDescription>
              </DialogHeader>
              
              {selectedPaymentMethod && (
                <div className="space-y-4">
                  <div className={`p-3 rounded-md ${
                    paymentMethods.find(m => m.id === selectedPaymentMethod)?.backgroundColor
                  } ${
                    paymentMethods.find(m => m.id === selectedPaymentMethod)?.textColor
                  }`}>
                    <p className="text-sm font-medium mb-1">Send money to:</p>
                    <p className="text-lg font-bold">
                      {paymentMethods.find(m => m.id === selectedPaymentMethod)?.number}
                    </p>
                    <p className="text-xs mt-1 opacity-90">
                      Amount: ৳{formatCurrency(calculateTotal())}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="modal-phone">Your Phone Number</Label>
                      <Input
                        id="modal-phone"
                        placeholder="Enter your phone number"
                        value={modalPhoneNumber}
                        onChange={(e) => setModalPhoneNumber(e.target.value)}
                      />
                    </div>
                    
                    <div className="text-center text-sm text-gray-500">OR</div>
                    
                    <div>
                      <Label htmlFor="modal-transaction">Transaction ID</Label>
                      <Input
                        id="modal-transaction"
                        placeholder="Enter transaction ID"
                        value={modalTransactionId}
                        onChange={(e) => setModalTransactionId(e.target.value)}
                      />
                    </div>
                    
                    {modalFieldError && (
                      <p className="text-sm text-red-600">{modalFieldError}</p>
                    )}
                  </div>
                </div>
              )}
              
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={handleModalCancel}>
                  Cancel
                </Button>
                <Button onClick={handleModalConfirm}>
                  Confirm Payment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
              disabled={!formData.fullName || !formData.streetAddress || !formData.city || !formData.phone || !selectedPaymentMethod || !transactionId.trim()}
            >
              Place Order
            </Button>
          )}
          
          {!isCartEmpty && (formData.fullName === '' || formData.streetAddress === '' || formData.city === '' || formData.phone === '' || !selectedPaymentMethod || !transactionId.trim()) && (
            <p className="text-xs sm:text-sm text-red-500 text-center mt-2">
              Please fill in all required fields, select a payment method, and enter transaction details to place your order
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
