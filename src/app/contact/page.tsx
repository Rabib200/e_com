"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ContactPage = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission with a delay
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.");
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-24 max-w-5xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-amber-600">
          Contact Us
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          We&apos;d love to hear from you! Get in touch with our team.
        </p>
        <Separator className="max-w-md mx-auto bg-amber-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        {/* Contact Information */}
        <div>
          <div className="bg-amber-50 p-6 md:p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-6">Get In Touch</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-amber-100 rounded-full h-10 w-10 flex-shrink-0 flex items-center justify-center text-amber-800">
                  <span>📧</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email</h3>
                  <p className="text-gray-700">support@fitandkit.com</p>
                  <p className="text-gray-700">fitandkit.store@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-amber-100 rounded-full h-10 w-10 flex-shrink-0 flex items-center justify-center text-amber-800">
                  <span>📞</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Phone</h3>
                  <p className="text-gray-700">019539655548</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-amber-100 rounded-full h-10 w-10 flex-shrink-0 flex items-center justify-center text-amber-800">
                  <span>📍</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Address</h3>
                  <p className="text-gray-700">Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden border border-gray-200 shadow-md">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.9260138934174!2d90.43092697601483!3d23.713870484588087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQyJzUwLjAiTiA5MMKwMjYnMDAuNyJF!5e0!3m2!1sen!2sbd!4v1715356358821!5m2!1sen!2sbd" 
              width="100%" 
              height="300" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Fit & Kit Location"
              className="w-full"
            />
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border border-gray-200">
          <h2 className="text-xl font-bold mb-6">Send Us A Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your Name"
                value={formState.name}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formState.email}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                placeholder="What's this about?"
                value={formState.subject}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                name="message"
                placeholder="Your message here..."
                value={formState.message}
                onChange={handleChange}
                required
                className="w-full min-h-[120px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 mt-1"
                rows={5}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-amber-600 hover:bg-amber-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </div>

      {/* Follow Us Section */}
      <div className="bg-gray-50 p-6 md:p-10 rounded-lg shadow-md text-center mb-16">
        <h2 className="text-xl font-bold mb-4">Follow Us On Social Media</h2>
        <p className="text-gray-700 mb-6">Stay connected for updates, promotions, and more!</p>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          <a 
            href="https://www.facebook.com/fitandkits" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 hover:bg-white hover:shadow-md rounded-lg transition-all duration-200"
          >
            <div className="bg-blue-500 text-white p-3 rounded-full mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
              </svg>
            </div>
            <span className="font-medium">Facebook</span>
          </a>
          
          <a 
            href="https://www.instagram.com/fitandkit.store?igsh=MTUxOXhzcTNib2loZg==" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 hover:bg-white hover:shadow-md rounded-lg transition-all duration-200"
          >
            <div className="bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 text-white p-3 rounded-full mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3Z" />
              </svg>
            </div>
            <span className="font-medium">Instagram</span>
          </a>
          
          <a 
            href="https://twitter.com/fitandkit" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 hover:bg-white hover:shadow-md rounded-lg transition-all duration-200"
          >
            <div className="bg-blue-400 text-white p-3 rounded-full mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69c.88-.53 1.56-1.37 1.88-2.38c-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29c0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15c0 1.49.75 2.81 1.91 3.56c-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07a4.28 4.28 0 0 0 4 2.98a8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56c.84-.6 1.56-1.36 2.14-2.23Z" />
              </svg>
            </div>
            <span className="font-medium">Twitter</span>
          </a>
        </div>
      </div>

      {/* Store Hours */}
      <div className="bg-amber-50 p-6 md:p-10 rounded-lg shadow-md text-center mb-16">
        <h2 className="text-xl font-bold mb-4">Store Hours</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Image 
                src="/globe.svg" 
                alt="Online Store" 
                width={32} 
                height={32} 
                className="opacity-70"
              />
            </div>
            <h3 className="font-bold text-lg mb-2">Online Platform</h3>
            <p className="text-gray-700">We are always open</p>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Image 
                src="/window.svg" 
                alt="Physical Store" 
                width={32} 
                height={32} 
                className="opacity-70"
              />
            </div>
            <h3 className="font-bold text-lg mb-2">Physical Outlet</h3>
            <p className="text-gray-700">Saturday – Friday</p>
            <p className="text-gray-700">5 PM to 11 PM</p>
          </div>
        </div>
      </div>

      {/* FAQs Link */}
      <div className="text-center">
        <p className="text-gray-700 mb-6">
          Have more questions? Check out our frequently asked questions or contact our team.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/faq" 
            className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-6 rounded-md transition-colors text-center"
          >
            View FAQs
          </Link>
          <Link 
            href="/" 
            className="bg-black hover:bg-gray-800 text-white py-2 px-6 rounded-md transition-colors text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;