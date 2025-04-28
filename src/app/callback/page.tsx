'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { ErrorWithResponse } from '@/lib/errorTemplate';
import { CartItem } from '@/lib/types';

type PaymentStatus = 'loading' | 'success' | 'failure' | 'cancel';

// Create a client component that uses the searchParams
function CallbackClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<PaymentStatus>('loading');
  const [message, setMessage] = useState('Processing your payment...');
  interface PaymentDetails {
    trxID?: string;
    paymentID?: string;
    amount?: number;
    currency?: string;
    transactionStatus?: string;
    [key: string]: string | number | boolean | null | undefined; // Optional: For additional dynamic fields
  }

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

  useEffect(() => {
    // Function to save order to your database
    const saveOrder = async (paymentDetails: PaymentDetails) => {
      try {
        // Get customer info from local storage if you saved it during checkout
        const customerInfo = JSON.parse(localStorage.getItem('customerInfo') || '{}');
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // Ensure cartItems is an array
        const validCartItems = Array.isArray(cartItems) ? cartItems : [];
        
        // Validate required customer information
        if (!customerInfo.fullName || !customerInfo.streetAddress || !customerInfo.city) {
          console.error('Missing required customer information');
          return false;
        }
        
        // Validate cart items
        if (!validCartItems.length) {
          console.error('Cart is empty');
          return false;
        }
        
        // Ensure amount is available - fix the type issue with proper type checking
        const totalAmount = paymentDetails.amount || 
          validCartItems.reduce((total: number, item: CartItem) => {
            // Safe type handling for price
            let price: number;
            if (typeof item.price === 'string') {
              // Only try to replace if it's a string
              price = parseFloat(item.price) || 0;
            } else if (typeof item.price === 'number') {
              price = item.price;
            } else {
              price = 0; // Default if price is undefined or null
            }
            
            const itemQuantity = item.quantity || 1;
            return total + (price * itemQuantity);
          }, 0);
        
        const orderData = {
          paymentDetails,
          customerInfo,
          items: validCartItems,
          orderDate: new Date().toISOString(),
          totalAmount: totalAmount
        };
        
        console.log('Sending order data:', orderData);
        
        // Send to order API endpoint
        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });
        
        if (!orderResponse.ok) {
          const errorData = await orderResponse.json();
          console.error('Failed to save order:', errorData);
          return false;
        }
        
        const result = await orderResponse.json();
        console.log('Order saved successfully:', result);
        
        // Clear the cart and customer info from localStorage
        localStorage.removeItem('cart');
        
        return true;
      } catch (error) {
        console.error('Error saving order:', error);
        return false;
      }
    };

    const processPayment = async () => {
      try {
        // Get the payment ID and status from search params
        const paymentID = searchParams.get('paymentID');
        const statusParam = searchParams.get('status')?.toLowerCase();
        
        if (!paymentID) {
          throw new Error('Payment ID not found in URL');
        }
        
        // Handle immediate cancel status from bKash
        if (statusParam === 'cancel') {
          setStatus('cancel');
          setMessage('Payment was cancelled');
          return;
        }
        
        // Handle immediate failure status from bKash
        if (statusParam === 'failure') {
          setStatus('failure');
          setMessage('Payment failed. Please try again.');
          return;
        }
        
        // For 'success' status or no status, try to execute the payment
        // First get a new token
        const tokenResponse = await fetch('/api/bkash-getToken');
        if (!tokenResponse.ok) {
          throw new Error('Failed to get access token');
        }
        
        const tokenData = await tokenResponse.json();
        const token = tokenData.id_token;
        
        // Execute the payment
        const executeResponse = await fetch('/api/bkash-executePayment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            paymentID,
            token: token
          })
        });
        
        if (!executeResponse.ok) {
          const errorData = await executeResponse.json();
          
          // Check if it's a specific error that indicates cancellation
          if (errorData.error?.statusCode === '2029' || 
              errorData.error?.statusMessage?.toLowerCase().includes('cancel')) {
            setStatus('cancel');
            setMessage('Payment was cancelled');
          } else {
            setStatus('failure');
            setMessage(errorData.error?.statusMessage || 'Payment execution failed');
          }
          return;
        }
        
        const executionResult = await executeResponse.json();
        
        // Check transaction status from the result
        const transactionStatus = executionResult.transactionStatus?.toLowerCase();
        if (transactionStatus === 'completed' || transactionStatus === 'success') {
          // Payment successful
          await saveOrder(executionResult);
          setPaymentDetails(executionResult);
          setStatus('success');
          setMessage('Payment successful!');
          
          // Clear the cart after successful payment
          localStorage.removeItem('cart');
        } else if (transactionStatus === 'cancel' || transactionStatus === 'cancelled') {
          setStatus('cancel');
          setMessage('Payment was cancelled');
        } else {
          // Any other status is treated as failure
          setStatus('failure');
          setMessage(`Payment failed: ${executionResult.statusMessage || 'Unknown error'}`);
        }
        
      } catch (error: unknown) {
        console.error('Payment processing failed:', error);
        const typedError = error as ErrorWithResponse;
        setStatus('failure');
        setMessage(`Payment failed: ${typedError.message}`);
      }
    };
    
    processPayment();
  }, [searchParams]);
  
  const handleContinueShopping = () => {
    router.push('/');
  };
  
  const handleTryAgain = () => {
    // Redirect to checkout or billing page
    router.push('/billing');
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {status === 'loading' && (
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
          <p>Please wait while we confirm your payment...</p>
        </div>
      )}
      
      {status === 'success' && (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-2">Thank you for your order.</p>
          <p className="text-gray-600 mb-6">Your transaction ID: {paymentDetails?.trxID || paymentDetails?.paymentID}</p>
          
          {paymentDetails && (
            <div className="mb-6 text-left border-t border-b py-4">
              <h3 className="font-semibold mb-2">Payment Details:</h3>
              <p>Amount: {paymentDetails.amount} {paymentDetails.currency}</p>
              <p>Payment Method: bKash</p>
              <p>Status: {paymentDetails.transactionStatus || 'Completed'}</p>
              <p>Payment Time: {new Date().toLocaleString()}</p>
            </div>
          )}
          
          <button
            onClick={handleContinueShopping}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      )}
      
      {status === 'failure' && (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Payment Failed</h1>
          <p className="text-gray-600 mb-6">{message}</p>
          <button
            onClick={handleTryAgain}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Try Again
          </button>
          <button
            onClick={handleContinueShopping}
            className="w-full mt-3 py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Return to Shop
          </button>
        </div>
      )}
      
      {status === 'cancel' && (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Payment Cancelled</h1>
          <p className="text-gray-600 mb-6">Your payment process was cancelled.</p>
          <button
            onClick={handleTryAgain}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Try Again
          </button>
          <button
            onClick={handleContinueShopping}
            className="w-full mt-3 py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Return to Shop
          </button>
        </div>
      )}
    </div>
  );
}

// Main page component with Suspense
export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading Payment Details</h2>
          <p>Please wait...</p>
        </div>
      </div>
    }>
      <CallbackClient />
    </Suspense>
  );
}