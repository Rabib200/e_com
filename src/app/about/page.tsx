"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-24 max-w-5xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-amber-600">About Fit & Kit</h1>
        <p className="text-lg text-gray-600 mb-8">Your destination for style that fits your life.</p>
        <Separator className="max-w-md mx-auto bg-amber-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Welcome to Fit & Kit</h2>
          <p className="mb-4 text-gray-700">
            Your go-to destination for stylish, functional, and confidence-boosting menswear. At Fit & Kit, we&apos;re passionate about helping men look sharp and feel their best, whether they&apos;re hitting the gym, heading to work, or stepping out for the weekend.
          </p>
          <p className="mb-4 text-gray-700">
            Our curated collection offers high-quality essentials and on-trend pieces designed to fit your lifestyle.
          </p>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 mt-6">
            <Link 
              href="/products" 
              className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-6 rounded-md transition-colors text-center"
            >
              Shop Collection
            </Link>
            <Link 
              href="/contact" 
              className="bg-black hover:bg-gray-800 text-white py-2 px-6 rounded-md transition-colors text-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
        <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl">
          <Image 
            src="/mainCropped.jpg" 
            alt="Fit & Kit Store" 
            fill
            className="object-cover" 
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Collection</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-amber-600 text-3xl mb-3">👖</div>
            <h3 className="font-bold text-lg mb-2">Bottoms</h3>
            <p className="text-gray-700">From tailored trousers to relaxed joggers—perfect fits for every occasion.</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-amber-600 text-3xl mb-3">👕</div>
            <h3 className="font-bold text-lg mb-2">T-Shirts & Polos</h3>
            <p className="text-gray-700">Classic and modern styles built for comfort and versatility.</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-amber-600 text-3xl mb-3">🧥</div>
            <h3 className="font-bold text-lg mb-2">Outerwear</h3>
            <p className="text-gray-700">Lightweight layers and bold jackets to complete your look.</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-amber-600 text-3xl mb-3">👟</div>
            <h3 className="font-bold text-lg mb-2">Accessories</h3>
            <p className="text-gray-700">The finishing touches that elevate your outfit from basic to standout.</p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 p-6 md:p-10 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Why Choose Fit & Kit?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
          <div className="flex gap-4">
            <div className="bg-amber-100 rounded-full h-10 w-10 flex-shrink-0 flex items-center justify-center text-amber-800">
              ✅
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Smart Style Meets Comfort</h3>
              <p className="text-gray-700">Every item is made with premium materials to ensure all-day wearability.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-amber-100 rounded-full h-10 w-10 flex-shrink-0 flex items-center justify-center text-amber-800">
              ✅
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Affordable Fashion for Every Man</h3>
              <p className="text-gray-700">Great style shouldn&apos;t cost a fortune—we make sure it doesn&apos;t.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-amber-100 rounded-full h-10 w-10 flex-shrink-0 flex items-center justify-center text-amber-800">
              ✅
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Effortless Shopping</h3>
              <p className="text-gray-700">Easy browsing, smooth checkout, and a customer-first experience every time.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-amber-100 rounded-full h-10 w-10 flex-shrink-0 flex items-center justify-center text-amber-800">
              ✅
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Fast Delivery & Easy Returns</h3>
              <p className="text-gray-700">Because your time is valuable, and satisfaction is guaranteed.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to elevate your style?</h2>
        <p className="text-gray-700 mb-6">Browse our collection today and discover your new favorite pieces.</p>
        <Link 
          href="/products" 
          className="bg-amber-600 hover:bg-amber-700 text-white py-3 px-8 rounded-md transition-colors inline-block font-medium"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;