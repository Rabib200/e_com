'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { 
  Truck, 
  CheckCircle, 
  Clock, 
  ShoppingBag, 
  AlertTriangle,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { OrderStatus } from '@/lib/orderStatus.enum';

// Interface to match the API response
interface OrderDetails {
  id: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  paymentStatus: string;
  transactionId: string;
}

interface OrderItem {
  id: number;
  order_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  items: {
    id: string;
    title: string;
    price: number;
    originalPrice: number;
    quantity: number;
    size: string | null;
    image: string[];
    discountPrice: number | null;
  };
}

// Loading component for suspense fallback
const OrderLoadingState = () => (
  <div className="flex justify-center items-center min-h-screen pt-20">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
  </div>
);

// Create a separate component that uses useSearchParams
const OrderContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('No order ID provided');
        setLoading(false);
        return;
      }
      
      try {
        // Using the proper API endpoint
        const response = await fetch(`/api/orders/${orderId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Could not load order details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl pt-28 sm:pt-32">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-700 mb-2">Error Loading Order</h1>
          <p className="text-red-600 mb-4">{error || 'Could not find order details'}</p>
          <Link href="/" className="inline-block px-6 py-2.5 bg-amber-600 text-white font-medium rounded-md">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
  
  // Get date in a readable format
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Define the steps in order process
  const steps = [
    { id: 'pending', label: 'Order Placed', icon: ShoppingBag },
    { id: 'processing', label: 'Processing', icon: Clock },
    { id: 'shipped', label: 'Shipped', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle }
  ];
  
  // Find the current step index
  const currentStepIndex = steps.findIndex(step => step.id === order.status);
  const isOrderCancelled = order.status === 'cancelled';
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 mt-32 sm:mt-36">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        {/* Order confirmation header */}
        <div className="text-center mb-6 sm:mb-8">
          <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500 mx-auto mb-3 sm:mb-4" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Order Details</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Thank you for your purchase. Here are your order details.
          </p>
        </div>
        
        {/* Order details */}
        <div className="bg-gray-50 p-3 sm:p-4 rounded-md mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row justify-between mb-3 sm:mb-4 gap-2">
            <div className="mb-2 md:mb-0">
              <p className="text-xs sm:text-sm text-gray-500">Order Number</p>
              <p className="text-sm sm:text-base font-medium">{order.id}</p>
            </div>
            <div className="mb-2 md:mb-0">
              <p className="text-xs sm:text-sm text-gray-500">Date Placed</p>
              <p className="text-sm sm:text-base font-medium">{orderDate}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Total Amount</p>
              <p className="text-sm sm:text-base font-medium">৳{order.totalAmount?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
          
          {/* Payment info */}
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
            <div className="flex items-center mb-2">
              <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600 mr-2" />
              <p className="text-xs sm:text-sm font-medium text-gray-700">Payment Information</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm gap-1 sm:gap-0">
              <div>
                <span className="text-gray-500">Method:</span> bKash
              </div>
              <div>
                <span className="text-gray-500">Status:</span> {order.paymentStatus}
              </div>
              <div className="break-all">
                <span className="text-gray-500">Transaction ID:</span> {order.transactionId}
              </div>
            </div>
          </div>
        </div>
        
        {/* Customer Information */}
        <div className="mb-6 sm:mb-8 bg-gray-50 p-3 sm:p-4 rounded-md">
          <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Customer Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex items-start">
              <User className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600 mt-1 mr-2" />
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Name</p>
                <p className="text-sm sm:text-base font-medium">{order.customerName}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600 mt-1 mr-2" />
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Email</p>
                <p className="text-sm sm:text-base font-medium break-all">{order.customerEmail}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600 mt-1 mr-2" />
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                <p className="text-sm sm:text-base font-medium">{order.customerPhone}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600 mt-1 mr-2" />
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Shipping Address</p>
                <p className="text-sm sm:text-base font-medium">{order.shippingAddress}, {order.city}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Horizontal status tracker */}
        {isOrderCancelled ? (
          <div className="bg-red-50 p-3 sm:p-4 rounded-md mb-5 sm:mb-6 text-center">
            <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 mx-auto mb-2" />
            <h2 className="text-base sm:text-lg font-semibold text-red-700">Order Cancelled</h2>
            <p className="text-xs sm:text-sm text-red-600 mt-1">
              This order has been cancelled. Please contact customer support for more information.
            </p>
          </div>
        ) : (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Order Status</h2>
            <div className="relative">
              {/* Progress bar - visible on all screen sizes but styled differently */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 sm:h-1 bg-gray-200 transform -translate-y-1/2 z-0">
                <div 
                  className="h-full bg-amber-600 transition-all duration-500" 
                  style={{ 
                    width: `${currentStepIndex >= 0 ? 
                      (currentStepIndex / (steps.length - 1)) * 100 : 0}%` 
                  }}
                ></div>
              </div>
              
              {/* Steps */}
              <div className="relative z-10 flex justify-between">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = index <= currentStepIndex;
                  const isCurrentStep = index === currentStepIndex;
                  
                  return (
                    <div 
                      key={step.id} 
                      className="flex flex-col items-center"
                    >
                      <div className={`
                        flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10 rounded-full 
                        ${isActive ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-500'}
                        ${isCurrentStep ? 'ring-2 sm:ring-4 ring-amber-100' : ''}
                        transition-all duration-200
                      `}>
                        <StepIcon className="h-3 w-3 sm:h-5 sm:w-5" />
                      </div>
                      <div className="mt-1 sm:mt-2 text-center">
                        <p className={`text-xs sm:text-sm font-medium ${
                          isActive ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </p>
                        {isCurrentStep && (
                          <span className="hidden sm:block text-xs text-amber-600 mt-1">Current</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        {/* Order Items */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Order Items</h2>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-2 sm:px-3 py-2 sm:py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th scope="col" className="px-2 sm:px-3 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-2 sm:px-3 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-2 sm:px-3 py-3 sm:py-4">
                        <div className="text-xs sm:text-sm font-medium text-gray-900">
                          {item.product_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.items.size && `Size: ${item.items.size}`}
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 text-center">
                        {item.quantity}
                      </td>
                      <td className="px-2 sm:px-3 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 text-right whitespace-nowrap">
                        ৳{item.unit_price.toFixed(2)}
                      </td>
                      <td className="px-2 sm:px-3 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900 text-right whitespace-nowrap">
                        ৳{item.total_price.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-2 sm:px-3 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium text-gray-900">
                      Total
                    </td>
                    <td className="px-2 sm:px-3 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap">
                      ৳{order.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        
        {/* What's next section */}
        <div className="border-t pt-4 sm:pt-6">
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">What&apos;s Next?</h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">
            {order.status === OrderStatus.PENDING && "We've received your order and are preparing it for processing."}
            {order.status === OrderStatus.PROCESSING && "Your order is being processed and will be shipped soon."}
            {order.status === OrderStatus.SHIPPED && "Your order is on its way! Track your shipment using the tracking information."}
            {order.status === OrderStatus.DELIVERED && "Your order has been delivered. Enjoy your products!"}
            {order.status === OrderStatus.CANCELLED && "Your order has been cancelled. If you have any questions, please contact customer support."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
            <Link href="/" className="inline-block px-4 sm:px-6 py-2 sm:py-2.5 bg-amber-600 text-white text-sm sm:text-base font-medium rounded-md text-center hover:bg-amber-700 transition-colors">
              Continue Shopping
            </Link>
            <Link href="/contact" className="inline-block px-4 sm:px-6 py-2 sm:py-2.5 border border-amber-600 text-sm sm:text-base text-amber-600 font-medium rounded-md text-center hover:bg-amber-50 transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main page component with Suspense
const OrderPage = () => {
  return (
    <Suspense fallback={<OrderLoadingState />}>
      <OrderContent />
    </Suspense>
  );
};

export default OrderPage;