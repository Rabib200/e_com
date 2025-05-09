"use client";

import React from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto px-4 py-24 max-w-5xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-amber-600">
          Privacy Policy
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your privacy is important to us at Fit & Kit
        </p>
        <Separator className="max-w-md mx-auto bg-amber-200" />
      </div>

      <div className="prose prose-amber max-w-none mb-16">
        <div className="bg-amber-50 p-6 md:p-10 rounded-lg shadow-md mb-10">
          <p className="mb-6">
            Welcome to <a href="https://www.fitandkit.shop/" className="text-amber-600 hover:underline">https://www.fitandkit.shop/</a>. 
            These Terms and Conditions govern your use of our website, 
            <a href="https://www.fitandkit.shop/" className="text-amber-600 hover:underline">https://www.fitandkit.shop/</a>, 
            and the services provided through it. By accessing or using the Site, you agree to be bound by these Terms. 
            If you do not agree, please discontinue use of the site immediately.
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">1. Eligibility</h2>
            <p>
              By using this site, you affirm that you are at least 18 years old, or the legal age of majority in your jurisdiction. 
              If you are under the legal age, you may only use the site under the supervision of a parent or guardian.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">2. Account Registration</h2>
            <p className="mb-2">To access certain features, you may need to register for an account. You agree to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide accurate, current, and complete information.</li>
              <li>Keep your login credentials secure.</li>
              <li>Notify us of unauthorized access immediately.</li>
            </ul>
            <p className="mt-2">You are responsible for any activity conducted through your account.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">3. Products and Services</h2>
            <p className="mb-2"><strong>Product Descriptions:</strong> We strive to provide accurate information about all products listed. However, we do not guarantee descriptions or pricing are error-free.</p>
            <p className="mb-2"><strong>Availability:</strong> Products may be limited or discontinued at any time. We reserve the right to refuse or limit orders at our discretion.</p>
            <p><strong>Pricing & Payment:</strong> All prices are in Bangladeshi Taka (BDT), unless otherwise noted, and are subject to change without notice. Orders must be paid using available payment methods on the site.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">4. Order Processing</h2>
            <p>
              Receiving an order confirmation does not mean your order has been accepted. We reserve the right to cancel or limit orders, 
              including due to errors in product or pricing information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">5. Shipping & Delivery</h2>
            <p className="mb-2">
              We currently ship within Bangladesh. Delivery times and fees vary depending on your location and shipping method. 
              Shipping estimates will be provided at checkout.
            </p>
            <p><strong>Risk of Loss:</strong> Title and risk of loss pass to you upon delivery to the carrier.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">7. Prohibited Conduct</h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use the site for any unlawful purpose.</li>
              <li>Violate local or international laws.</li>
              <li>Interfere with site functionality.</li>
              <li>Upload or share unlawful, defamatory, or infringing content.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">8. Intellectual Property</h2>
            <p>
              All content on https://www.fitandkit.shop/—including text, images, logos, and software — is owned or licensed by TechBazaar and protected by 
              copyright and trademark laws. You may not reproduce or use content without permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">9. Privacy Policy</h2>
            <p>
              Your use of the site is governed by our Privacy Policy, which explains how we collect, use, and safeguard your data. 
              Continued use of the site indicates your consent to these practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">10. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Fit & Kit will not be liable for any indirect, incidental, or consequential damages 
              arising from your use of the site or any purchases made.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">11. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless TechBazaar and its affiliates from any claims or liabilities arising from your breach of 
              these Terms or misuse of the Site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">12. Modifications to the Terms</h2>
            <p>
              We may update these terms periodically. Changes will be effective once posted. Continued use of the site signifies your 
              acceptance of the updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">13. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account or access to the site at any time, with or without cause or notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">14. Governing Law</h2>
            <p>
              These terms shall be governed by the laws of Bangladesh. Any disputes will be resolved in the courts of Bangladesh.
            </p>
          </section>
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-700 mb-6">
          Last Updated: May 10, 2025
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/" 
            className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-6 rounded-md transition-colors text-center"
          >
            Back to Home
          </Link>
          <Link 
            href="/contact" 
            className="bg-black hover:bg-gray-800 text-white py-2 px-6 rounded-md transition-colors text-center"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;