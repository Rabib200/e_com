"use client";

import React from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const ReturnPolicyPage = () => {
  return (
    <div className="container mx-auto px-4 py-24 max-w-5xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-amber-600">
          Return & Exchange Policy
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Our commitment to your satisfaction
        </p>
        <Separator className="max-w-md mx-auto bg-amber-200" />
      </div>

      <div className="mb-12">
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-md">
          <p className="text-gray-700 mb-6 text-lg">
            At Fit & Kit, we believe the right outfit can change your day—and your mindset. 
            Whether you&apos;re building a wardrobe or upgrading your essentials, we&apos;re here to 
            help you feel confident, comfortable, and ready for anything.
          </p>
          <p className="text-gray-700 mb-8 text-lg font-medium">
            Thanks for choosing Fit & Kit—where style fits and comfort sticks.
          </p>
          
          <h2 className="text-2xl font-bold text-amber-700 mb-6">Fit & Kit Return & Exchange Policy</h2>
          <p className="text-gray-800 mb-8 text-lg">
            At Fit & Kit, your satisfaction is our priority! We want you to love what you ordered — 
            but if something isn&apos;t right, we&apos;re here to help.
          </p>

          <div className="space-y-10">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-amber-600 text-2xl">✅</span>
                <h3 className="text-xl font-bold">Eligibility for Return or Exchange</h3>
              </div>
              <div className="pl-11">
                <p className="mb-3">You may request a return or exchange if:</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>The item is defective, damaged, or different from what you ordered.</li>
                  <li>The item is unused, unwashed, and in its original condition with all tags/packaging.</li>
                  <li>You notify us within 3 days of receiving the product.</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-amber-600 text-2xl">🔁</span>
                <h3 className="text-xl font-bold">Exchange Policy</h3>
              </div>
              <div className="pl-11">
                <p className="mb-3">We offer size or color exchanges for eligible items if stock is available. You must:</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Send a message to our page with your order details and reason for exchange.</li>
                  <li>Ship the item back to us within 5 days of approval (delivery cost borne by customer unless we sent the wrong item).</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-amber-600 text-2xl">💸</span>
                <h3 className="text-xl font-bold">Return & Refund Policy</h3>
              </div>
              <div className="pl-11">
                <p className="mb-3">If a replacement isn&apos;t possible, we&apos;ll offer:</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>A full refund (for wrong/damaged items).</li>
                  <li>A store credit (for other eligible returns based on case-by-case review).</li>
                </ul>
                <p className="mt-4 text-gray-600 italic">
                  Note: Cash refunds are not applicable for items returned due to size issues unless it was a Fit & Kit error.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-amber-600 text-2xl">❌</span>
                <h3 className="text-xl font-bold">Non-Returnable Items</h3>
              </div>
              <div className="pl-11">
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Items bought on sale or with discount codes.</li>
                  <li>Innerwear or personal hygiene-related products.</li>
                  <li>Items returned after the 3-day notification window.</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-amber-600 text-2xl">📦</span>
                <h3 className="text-xl font-bold">How to Initiate a Return or Exchange</h3>
              </div>
              <div className="pl-11">
                <p className="mb-3">Message us on our Facebook page: <a href="https://www.facebook.com/fitandkits" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">Fit & Kit</a></p>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                  <li>Provide the order number, reason, and clear photos (if applicable).</li>
                  <li>Wait for confirmation and return instructions.</li>
                </ol>
                <p className="mt-4 text-gray-600 italic">
                  We reserve the right to reject returns or exchanges that do not meet our policy terms.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 p-6 md:p-8 rounded-lg shadow-md mb-12">
        <h2 className="text-xl font-bold mb-6 text-center">Have Questions About Your Return?</h2>
        <p className="text-center text-gray-700 mb-6">
          We&apos;re here to help! Contact our customer support team for assistance.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/contact" 
            className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-6 rounded-md transition-colors text-center"
          >
            Contact Us
          </Link>
          <Link 
            href="/faq" 
            className="bg-black hover:bg-gray-800 text-white py-2 px-6 rounded-md transition-colors text-center"
          >
            View FAQs
          </Link>
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-600 mb-6">
          Last Updated: May 10, 2025
        </p>
        <Link 
          href="/" 
          className="text-amber-600 hover:text-amber-700 font-medium"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;