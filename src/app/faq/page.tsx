"use client";

import React from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQPage = () => {
  return (
    <div className="container mx-auto px-4 py-24 max-w-5xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-amber-600">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Everything you need to know about shopping with Fit & Kit
        </p>
        <Separator className="max-w-md mx-auto bg-amber-200" />
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Return & Exchange Policy</h2>
        <p className="text-gray-700 mb-6">
          At Fit & Kit, we believe the right outfit can change your day—and your mindset. 
          Whether you&apos;re building a wardrobe or upgrading your essentials, we&apos;re here to 
          help you feel confident, comfortable, and ready for anything.
        </p>
        <p className="text-gray-700 mb-6">
          Thanks for choosing Fit & Kit—where style fits and comfort sticks.
        </p>

        <div className="bg-amber-50 p-6 md:p-10 rounded-lg shadow-md mb-10">
          <h3 className="text-xl font-bold mb-4">Fit & Kit Return & Exchange Policy</h3>
          <p className="text-gray-700 mb-6">
            At Fit & Kit, your satisfaction is our priority! We want you to love what 
            you ordered — but if something isn&apos;t right, we&apos;re here to help.
          </p>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center">
                  <span className="text-amber-600 mr-2">✅</span> 
                  Eligibility for Return or Exchange
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                <p className="mb-2">You may request a return or exchange if:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The item is defective, damaged, or different from what you ordered.</li>
                  <li>The item is unused, unwashed, and in its original condition with all tags/packaging.</li>
                  <li>You notify us within 3 days of receiving the product.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center">
                  <span className="text-amber-600 mr-2">🔁</span> 
                  Exchange Policy
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                <p className="mb-2">We offer size or color exchanges for eligible items if stock is available. You must:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Send a message to our page with your order details and reason for exchange.</li>
                  <li>Ship the item back to us within 5 days of approval (delivery cost borne by customer unless we sent the wrong item).</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center">
                  <span className="text-amber-600 mr-2">💸</span> 
                  Return & Refund Policy
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                <p className="mb-2">If a replacement isn&apos;t possible, we&apos;ll offer:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>A full refund (for wrong/damaged items).</li>
                  <li>A store credit (for other eligible returns based on case-by-case review).</li>
                </ul>
                <p className="mt-2 italic">Note: Cash refunds are not applicable for items returned due to size issues unless it was a Fit & Kit error.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center">
                  <span className="text-amber-600 mr-2">❌</span> 
                  Non-Returnable Items
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Items bought on sale or with discount codes.</li>
                  <li>Innerwear or personal hygiene-related products.</li>
                  <li>Items returned after the 3-day notification window.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center">
                  <span className="text-amber-600 mr-2">📦</span> 
                  How to Initiate a Return or Exchange
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Message us on our Facebook page: <a href="https://www.facebook.com/fitandkits" className="text-amber-600 hover:underline" target="_blank" rel="noopener noreferrer">Fit & Kit</a></li>
                  <li>Provide the order number, reason, and clear photos (if applicable).</li>
                  <li>Wait for confirmation and return instructions.</li>
                </ol>
                <p className="mt-2 italic">We reserve the right to reject returns or exchanges that do not meet our policy terms.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Other Common Questions</h2>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="general-1">
            <AccordionTrigger className="text-lg font-semibold">
              How long does shipping take?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              <p>
                We typically process orders within 1-2 business days. Delivery times vary by location:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Within Dhaka: 1-2 business days</li>
                <li>Outside Dhaka: 2-4 business days</li>
              </ul>
              <p className="mt-2">
                You&apos;ll receive tracking information via email or SMS once your order ships.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="general-2">
            <AccordionTrigger className="text-lg font-semibold">
              Do you offer size exchanges?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              <p>
                Yes, we offer size exchanges on eligible items subject to stock availability. Please contact us within 3 days of receiving your order to initiate an exchange. See our detailed exchange policy above for more information.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="general-3">
            <AccordionTrigger className="text-lg font-semibold">
              What payment methods do you accept?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              <p>
                We accept multiple payment methods for your convenience:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>bKash</li>
                <li>Cash on Delivery</li>
                <li>Credit/Debit Cards</li>
              </ul>
              <p className="mt-2">
                All transactions are secure and protected.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="general-4">
            <AccordionTrigger className="text-lg font-semibold">
              How can I track my order?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              <p>
                Once your order ships, you&apos;ll receive tracking information via email or SMS. You can also check your order status by logging into your account on our website or contacting our customer service team.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="bg-gray-50 p-6 md:p-10 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-bold mb-4">Still have questions?</h2>
        <p className="text-gray-700 mb-6">We&apos;re here to help! Reach out to our customer service team.</p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link 
            href="/contact" 
            className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-6 rounded-md transition-colors text-center"
          >
            Contact Us
          </Link>
          <a 
            href="https://www.facebook.com/fitandkits" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-black hover:bg-gray-800 text-white py-2 px-6 rounded-md transition-colors text-center"
          >
            Message on Facebook
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;