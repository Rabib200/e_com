"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaShoppingCart,
} from "react-icons/fa";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image"; // Import Image from next/image
import { cn } from "@/lib/utils";
import { axiosInstance } from "@/lib/supabase";
import { UUID } from "crypto";
import { useRouter } from "next/navigation";
import { Menu, Search } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
} from "@/components/ui/drawer";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Club Jersey",
    href: "/products?category=club-jersey",
    description: "Browse all available products.",
  },
  {
    title: "National Team Jersey",
    href: "/products?category=national-team-jersey",
    description: "Check out the latest additions to our collection.",
  },
  {
    title: "Retro Jersey",
    href: "/products?category=retro-jersey",
    description: "Discover our most popular products.",
  },
  {
    title: "T's",
    href: "/products?category=T-shirt",
    description: "Explore our wide range of caps.",
  },
  {
    title: "Polo T's",
    href: "/products?category=polo",
    description: "Find the perfect hat for any occasion.",
  },
  {
    title: "Drop Shoulders",
    href: "/products?category=drop-shoulder",
    description: "Stay warm with our stylish beanies.",
  },
  {
    title: "Sports Trousers",
    href: "/products?category=sports-trouser",
    description: "Explore our wide range of caps.",
  },
  {
    title: "Baggy Trousers",
    href: "/products?category=baggy-trouser",
    description: "Find the perfect hat for any occasion.",
  },
  {
    title: "Shorts",
    href: "/products?category=shorts",
    description: "Stay warm with our stylish beanies.",
  },
  {
    title: "Twill Pants",
    href: "/products?category=twill-pants",
    description: "Protect yourself from the sun with our visors.",
  },
  {
    title: "Denim Pants",
    href: "/products?category=denim-pants",
    description: "Get the latest fit&kit accessories.",
  },
  {
    title: "Cargo Pants",
    href: "/products?category=cargo-pants",
    description: "Shop our collection of caps for kids.",
  },
  {
    title: "Sweat Shirt",
    href: "/products?category=sweat-shirt",
    description: "Find the perfect hat for any occasion.",
  },
  {
    title: "Hoodie",
    href: "/products?category=hoodie",
    description: "Stay warm with our stylish beanies.",
  },
  {
    title: "Jacket",
    href: "/products?category=jacket",
    description: "Protect yourself from the sun with our visors.",
  },
  {
    title: "Adidas",
    href: "/products?category=adidas",
    description: "Get the latest Fit&Kit accessories.",
  },
  {
    title: "Nike",
    href: "/products?category=nike",
    description: "Shop our collection of caps for kids.",
  },

  {
    title: "Customer Support",
    href: "#",
    description: "Get help with your orders and inquiries.",
  },
  {
    title: "FAQ",
    href: "#",
    description: "Find answers to common questions.",
  },
];

const Header = () => {
  const [cartItems, setCartItems] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const getCart = JSON.parse(localStorage.getItem("cart") || "[]");

      if (getCart && Array.isArray(getCart)) {
        if (getCart.length > 0 && "quantity" in getCart[0]) {
          const totalItems = getCart.reduce(
            (total, item) => total + (item.quantity || 1),
            0
          );
          setCartItems(totalItems);
        } else {
          setCartItems(getCart.length);
        }
      } else {
        setCartItems(0);
      }
    } catch (error) {
      console.error("Error parsing cart from localStorage:", error);
      setCartItems(0);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await axiosInstance.get(`/products?title=ilike.*${searchQuery}*&isAvailable=eq.true&select=id,title,slug,image,price,discountPrice,status`);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchSearchResults();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowResults(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
      setSearchQuery('');
    }
  };


  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const toggleMobileSearch = () => {
    setMobileSearchOpen(!mobileSearchOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-black text-white p-4 md:p-6 z-50 shadow-md">
      <div className="flex items-center justify-between">
        {/* Left section - hamburger menu only */}
        <div className="md:hidden">
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon" className="bg-black border-white text-white hover:bg-gray-800">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[85vh]">
              <DrawerHeader className="border-b">
                <DrawerTitle>Menu</DrawerTitle>
                <DrawerDescription>
                  Browse our navigation menu
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-4 py-2 overflow-y-auto bg-black">
                {/* Search bar in drawer */}
                <div className="mb-4 relative" ref={searchRef}>
                  <form onSubmit={(e) => {
                    handleSearchSubmit(e);
                    closeDrawer();
                  }}>
                    <div className="relative flex items-center w-full">
                      <input
                        type="search"
                        name="search"
                        placeholder="Search for products..."
                        className="w-full py-2 px-4 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-amber-500"
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                      />
                      <button
                        type="submit"
                        className="absolute right-3 text-gray-400 hover:text-white"
                        aria-label="Search"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                    </div>
                  </form>
                  {showResults && (
                    <div className="absolute left-0 right-0 mt-2 w-full bg-black text-white shadow-lg rounded-lg p-4 z-[9999] max-h-60 overflow-y-auto">
                      {isSearching ? (
                        <div className="flex justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-amber-600"></div>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <>
                          {searchResults.map((result) => (
                            <a 
                              key={result.id} 
                              href={`/products/${result.slug}`} 
                              className="block mb-2 no-underline"
                              onClick={() => {
                                closeDrawer();
                              }}
                            >
                              <div className="py-2 px-2 hover:bg-gray-800 active:bg-gray-700 cursor-pointer rounded-md flex items-center gap-3">
                                <div className="w-12 h-12 relative flex-shrink-0 border border-gray-700 rounded-sm overflow-hidden">
                                  {result.image && result.image[0] ? (
                                    <Image
                                      src={result.image[0]}
                                      alt={result.title}
                                      fill
                                      sizes="48px"
                                      className="object-contain"
                                    />
                                  ) : (
                                    <div className="bg-gray-800 w-full h-full flex items-center justify-center text-gray-500 text-xs">
                                      No image
                                    </div>
                                  )}
                                  {result.status === "Out_of_Stock" && (
                                    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                                      <span className="text-white text-xs font-medium">Out of stock</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-grow">
                                  <p className="text-sm font-medium line-clamp-1 text-white">{result.title}</p>
                                  <div className="flex gap-2 items-center">
                                    {result.discountPrice ? (
                                      <>
                                        <span className="text-xs text-red-400">৳{result.discountPrice}</span>
                                        <span className="text-xs text-gray-400 line-through">৳{result.price}</span>
                                      </>
                                    ) : (
                                      <span className="text-xs text-gray-300">
                                        {result.price ? `৳${result.price}` : "Price not available"}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </a>
                          ))}
                          <div className="mt-2 pt-2 border-t border-gray-700 text-center">
                            <a 
                              href={`/products?search=${encodeURIComponent(searchQuery)}`}
                              className="block py-2 text-sm text-amber-500 hover:text-amber-400"
                              onClick={closeDrawer}
                            >
                              See all results for &quot;{searchQuery}&quot;
                            </a>
                          </div>
                        </>
                      ) : searchQuery.trim().length > 0 ? (
                        <div className="py-4 text-center">
                          <p className="text-sm">No results found for &quot;{searchQuery}&quot;</p>
                          <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
                
                <nav className="space-y-4">
                  <Link
                    href="/"
                    onClick={closeDrawer}
                    className="block py-3 px-4 text-lg font-medium text-white hover:bg-gray-800 rounded-md border border-gray-700"
                  >
                    Home
                  </Link>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="jersey" className="border-gray-700">
                      <AccordionTrigger className="py-2 px-3 text-white">
                        JERSEY
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-4 space-y-2">
                          {components.slice(0, 3).map((component) => (
                            <a
                              key={component.title}
                              href={component.href}
                              className="block py-2 px-3 text-sm text-white hover:bg-gray-800 rounded-md"
                            >
                              {component.title}
                            </a>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="tshirts" className="border-gray-700">
                      <AccordionTrigger className="py-2 px-3 text-white">
                        T-SHIRTS
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-4 space-y-2">
                          {components.slice(3, 6).map((component) => (
                            <a
                              key={component.title}
                              href={component.href}
                              className="block py-2 px-3 text-sm text-white hover:bg-gray-800 rounded-md"
                            >
                              {component.title}
                            </a>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="trousers" className="border-gray-700">
                      <AccordionTrigger className="py-2 px-3 text-white">
                        TROUSERS
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-4 space-y-2">
                          {components.slice(6, 9).map((component) => (
                            <a
                              key={component.title}
                              href={component.href}
                              className="block py-2 px-3 text-sm text-white hover:bg-gray-800 rounded-md"
                            >
                              {component.title}
                            </a>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="pants" className="border-gray-700">
                      <AccordionTrigger className="py-2 px-3 text-white">
                        PANTS
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-4 space-y-2">
                          {components.slice(9, 12).map((component) => (
                            <a
                              key={component.title}
                              href={component.href}
                              className="block py-2 px-3 text-sm text-white hover:bg-gray-800 rounded-md"
                            >
                              {component.title}
                            </a>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="winter" className="border-gray-700">
                      <AccordionTrigger className="py-2 px-3 text-white">
                        WINTER
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-4 space-y-2">
                          {components.slice(12, 15).map((component) => (
                            <a
                              key={component.title}
                              href={component.href}
                              className="block py-2 px-3 text-sm text-white hover:bg-gray-800 rounded-md"
                            >
                              {component.title}
                            </a>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="sneakers" className="border-gray-700">
                      <AccordionTrigger className="py-2 px-3 text-white">
                        SNEAKERS
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-4 space-y-2">
                          {components.slice(15, 16).map((component) => (
                            <a
                              key={component.title}
                              href={component.href}
                              className="block py-2 px-3 text-sm text-white hover:bg-gray-800 rounded-md"
                            >
                              {component.title}
                            </a>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="contact" className="border-gray-700">
                      <AccordionTrigger className="py-2 px-3 text-white">
                        Contact
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-4 space-y-2">
                          {components.slice(17).map((component) => (
                            <a
                              key={component.title}
                              href={component.href}
                              className="block py-2 px-3 text-sm text-white hover:bg-gray-800 rounded-md"
                            >
                              {component.title}
                            </a>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </nav>
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Center section - logo/title */}
        <div className="flex-1 flex justify-center items-center">
          <Link href={"/"} className="text-white">
            <div className="relative w-[250px] md:w-[250px]">
              <Image 
                src="/mainLogoCropped.jpg" 
                alt="fitandkit Logo" 
                width={250}
                height={100}
                className="object-contain max-h-16"
                priority
              />
            </div>
          </Link>
        </div>
        {/* Right section - search icon and cart for mobile */}
        <div className="flex md:hidden items-center gap-3">
          {/* Search icon for mobile - now to the left of cart */}
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-black border-white text-white hover:bg-gray-800"
            onClick={toggleMobileSearch}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          
          {/* Mobile cart */}
          <div className="relative">
            <FaShoppingCart
              className="text-white text-2xl cursor-pointer"
              onClick={toggleCart}
            />
            {cartItems > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartItems}
              </span>
            )}
          </div>
        </div>

        {/* Desktop navigation menu - updated */}
        <div className="hidden md:flex flex-grow justify-center">
          <NavigationMenu viewport={false} className="relative">
            <NavigationMenuList className="flex flex-wrap gap-2 md:gap-4">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/"
                  className="block py-2 px-3 text-white font-bold hover:bg-gray-800 rounded-md bg-black flex items-center h-10"
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-white bg-black flex items-center h-10">
                  JERSEY
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] lg:w-[500px] p-4 bg-black text-white">
                    <ul className="grid gap-3 lg:grid-cols-2">
                      {components.slice(0, 3).map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-white bg-black flex items-center h-10">
                  T-SHIRTS
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] lg:w-[500px] p-4 bg-black text-white">
                    <ul className="grid gap-3 lg:grid-cols-2">
                      {components.slice(3, 6).map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-white bg-black flex items-center h-10">
                  TROUSERS
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] lg:w-[500px] p-4 bg-black text-white">
                    <ul className="grid gap-3 lg:grid-cols-2">
                      {components.slice(6, 9).map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-white bg-black flex items-center h-10">
                  PANTS
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] lg:w-[500px] p-4 bg-black text-white">
                    <ul className="grid gap-3 lg:grid-cols-2">
                      {components.slice(9, 12).map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-white bg-black flex items-center h-10">
                  WINTER
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] lg:w-[500px] p-4 bg-black text-white">
                    <ul className="grid gap-3 lg:grid-cols-2">
                      {components.slice(12, 15).map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-white bg-black flex items-center h-10">
                  SNEAKERS
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] lg:w-[500px] p-4 bg-black text-white">
                    <ul className="grid gap-3">
                      {components.slice(15, 17).map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-white bg-black flex items-center h-10">
                  Contact
                </NavigationMenuTrigger>
                <NavigationMenuContent className="right-0 left-auto">
                  <div className="w-[400px] lg:w-[500px] p-4 bg-black text-white">
                    <ul className="grid gap-3 lg:grid-cols-2">
                      {components.slice(17).map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop cart - unchanged */}
        <div className="hidden md:block">
          <div className="relative">
            <FaShoppingCart
              className="text-white text-2xl cursor-pointer"
              onClick={toggleCart}
            />
            {cartItems > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartItems}
              </span>
            )}
            {isCartOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-black text-white shadow-lg rounded-lg p-4 z-50">
                <p className="text-sm">
                  You have {cartItems} items in your cart.
                </p>
                <a
                  className="mt-2 w-full inline-block text-center bg-amber-600 text-white py-2 px-4 rounded hover:bg-amber-700"
                  href="/cart"
                >
                  View Cart
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart dropdown for mobile - shown when cart is clicked */}
      {isCartOpen && (
        <div className="absolute top-16 right-4 w-48 bg-black text-white shadow-lg rounded-lg p-4 z-50 md:hidden">
          <p className="text-sm">
            You have {cartItems} items in your cart.
          </p>
          <a
            className="mt-2 w-full inline-block text-center bg-amber-600 text-white py-2 px-4 rounded hover:bg-amber-700"
            href="/cart"
          >
            View Cart
          </a>
        </div>
      )}

      {/* Mobile search box that appears when the search icon is clicked */}
      {mobileSearchOpen && (
        <div className="md:hidden mt-4 relative w-full" ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <div className="relative flex items-center w-full">
              <input
                type="search"
                name="search"
                placeholder="Search for products..."
                className="w-full py-2 px-4 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-amber-500"
                value={searchQuery}
                onChange={handleSearchInputChange}
                autoFocus
              />
              <button
                type="button"
                className="absolute right-10 text-gray-400 hover:text-white"
                onClick={() => setMobileSearchOpen(false)}
                aria-label="Close search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button
                type="submit"
                className="absolute right-3 text-gray-400 hover:text-white"
                aria-label="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
          {showResults && (
            <div className="absolute left-0 right-0 mt-2 w-full bg-black text-white shadow-lg rounded-lg p-4 z-[9999] max-h-60 overflow-y-auto">
              {isSearching ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-amber-600"></div>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  {searchResults.map((result) => (
                    <a 
                      key={result.id} 
                      href={`/products/${result.slug}`} 
                      className="block mb-2 no-underline"
                      onClick={() => {
                        setMobileSearchOpen(false);
                      }}
                    >
                      <div className="py-2 px-2 hover:bg-gray-800 active:bg-gray-700 cursor-pointer rounded-md flex items-center gap-3">
                        <div className="w-12 h-12 relative flex-shrink-0 border border-gray-700 rounded-sm overflow-hidden">
                          {result.image && result.image[0] ? (
                            <Image
                              src={result.image[0]}
                              alt={result.title}
                              fill
                              sizes="48px"
                              className="object-contain"
                            />
                          ) : (
                            <div className="bg-gray-800 w-full h-full flex items-center justify-center text-gray-500 text-xs">
                              No image
                            </div>
                          )}
                          {result.status === "Out_of_Stock" && (
                            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                              <span className="text-white text-xs font-medium">Out of stock</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm font-medium line-clamp-1 text-white">{result.title}</p>
                          <div className="flex gap-2 items-center">
                            {result.discountPrice ? (
                              <>
                                <span className="text-xs text-red-400">৳{result.discountPrice}</span>
                                <span className="text-xs text-gray-400 line-through">৳{result.price}</span>
                              </>
                            ) : (
                              <span className="text-xs text-gray-300">
                                {result.price ? `৳${result.price}` : "Price not available"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                  <div className="mt-2 pt-2 border-t border-gray-700 text-center">
                    <a 
                      href={`/products?search=${encodeURIComponent(searchQuery)}`}
                      className="block py-2 text-sm text-amber-500 hover:text-amber-400"
                      onClick={() => setMobileSearchOpen(false)}
                    >
                      See all results for &quot;{searchQuery}&quot;
                    </a>
                  </div>
                </>
              ) : searchQuery.trim().length > 0 ? (
                <div className="py-4 text-center">
                  <p className="text-sm">No results found for &quot;{searchQuery}&quot;</p>
                  <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}

      <div className="hidden md:block mt-4 max-w-2xl mx-auto relative w-full" ref={searchRef}>
        <form onSubmit={handleSearchSubmit}>
          <div className="relative flex items-center w-full">
            <input
              type="search"
              name="search"
              placeholder="Search for products..."
              className="w-full py-2 px-4 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-amber-500"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <button
              type="submit"
              className="absolute right-3 text-gray-400 hover:text-white"
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
        {showResults && (
          <div className="absolute mt-2 w-full bg-black text-white shadow-lg rounded-lg p-4 z-[100] max-h-80 overflow-y-auto">
            {isSearching ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-amber-600"></div>
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((result) => (
                <Link
                key={result.id}
                href={`/products/${result.slug}`}
                className="block"
                onClick={(e) => {
                  console.log("ON desktop Click")
                  e.stopPropagation();
                  setShowResults(false);
                  setSearchQuery('');
                }}
              >
                  <div className="py-2 px-2 hover:bg-gray-800 cursor-pointer rounded-md flex items-center gap-3">
                    <div className="w-12 h-12 relative flex-shrink-0 border border-gray-700 rounded-sm overflow-hidden">
                      {result.image && result.image[0] ? (
                        <Image
                          src={result.image[0]}
                          alt={result.title}
                          fill
                          sizes="48px"
                          className="object-contain"
                        />
                      ) : (
                        <div className="bg-gray-800 w-full h-full flex items-center justify-center text-gray-500 text-xs">
                          No image
                        </div>
                      )}
                      {result.status === "Out_of_Stock" && (
                        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                          <span className="text-white text-xs font-medium">Out of stock</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium line-clamp-1">{result.title}</p>
                      <div className="flex gap-2 items-center">
                        {result.discountPrice ? (
                          <>
                            <span className="text-xs text-red-400">৳{result.discountPrice}</span>
                            <span className="text-xs text-gray-400 line-through">৳{result.price}</span>
                          </>
                        ) : (
                          <span className="text-xs text-gray-300">
                            {result.price ? `৳${result.price}` : "Price not available"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : searchQuery.trim().length > 0 ? (
              <div className="py-4 text-center">
                <p className="text-sm">No results found for {searchQuery}</p>
                <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
              </div>
            ) : null}
            
            {searchResults.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-700 text-center">
                <button 
                  className="text-sm text-amber-500 hover:text-amber-400"
                  onClick={handleSearchSubmit}
                >
                  See all results for {searchQuery}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors text-white hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-white">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-gray-300">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const Footer = () => {
  return (
    <footer className="bg-black text-white p-4 text-center">
      <div className="mb-4">
        <p>Contact us: +123 456 7890</p>
        <p>Address: 123 Fit&Kit St, Dhaka, Bangladesh</p>
      </div>
      <div className="flex justify-center space-x-4 mb-4">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-300"
        >
          <FaFacebook className="text-2xl" />
        </a>
        <a 
          href="https://twitter.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-white hover:text-gray-300"
        >
          <FaTwitter className="text-2xl" />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-300"
        >
          <FaInstagram className="text-2xl" />
        </a>
      </div>
      <p className="mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia
        odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada.
      </p>
      <p>&copy; {new Date().getFullYear()} Fit & Kit</p>
    </footer>
  );
};

interface Product {
  id: UUID;
  image: string[];
  title: string;
  description: string;
  slug: string;
  category: string;
  status?: string;
  inStock?: boolean;
  price?: number;
  discountPrice?: number;
  discount?: number;
  discount_type?: string;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products?isAvailable=eq.true");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await axiosInstance.get("/products?isTrending=eq.true&isAvailable=eq.true&order=updated_at.asc");
        setTrending(response.data);
      } catch (error) {
        console.error("Error fetching trending products:", error);
      }
    };
    fetchTrendingProducts();
  }, []);

  function handleBuyNow(slug: string) {
    console.log("Buy Now Clicked for product:", slug);
    router.push(`/products/${slug}`);
  }

  const isOutOfStock = (product: Product) => {
    return product.status === "Out_of_Stock";
  };

  return (
    <div>
      <Header />
      <main className="p-4 sm:p-8 mt-32 sm:mt-36">
        <section className="bg-gradient-to-br from-gray-50 to-gray-200 p-4 sm:p-6 rounded-lg shadow-md">
          <div className="mb-6 sm:mb-8">
            <Carousel autoPlay autoPlayInterval={5000} className="w-full">
              <CarouselContent>
                <CarouselItem>
                  <div className="h-64 sm:h-80 md:h-96 relative overflow-hidden rounded-lg">
                    <Image
                      src="/mainBanner.jpg"
                      alt="main Banner"
                      fill
                      style={{
                        objectFit: "contain",
                        backgroundColor: "#f8f8f8",
                      }}
                      className="w-full h-full"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
                      priority
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="h-64 sm:h-80 md:h-96 relative overflow-hidden rounded-lg">
                    <Image
                      src="/banner1.webp"
                      alt="Eid Banner"
                      fill
                      style={{
                        objectFit: "contain",
                        backgroundColor: "#f8f8f8",
                      }}
                      className="w-full h-full"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
                      priority
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="h-64 sm:h-80 md:h-96 relative overflow-hidden rounded-lg">
                    <Image
                      src="/banner2.webp"
                      alt="Live Now Banner"
                      fill
                      style={{
                        objectFit: "contain",
                        backgroundColor: "#f8f8f8",
                      }}
                      className="w-full h-full"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
                      priority
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="h-64 sm:h-80 md:h-96 relative overflow-hidden rounded-lg">
                    <Image
                      src="/banner3.webp"
                      alt="Flash Sale Banner"
                      fill
                      style={{
                        objectFit: "contain",
                        backgroundColor: "#f8f8f8",
                      }}
                      className="w-full h-full"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
                      priority
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>

          <div className="text-center px-3 py-6 sm:py-8 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800 mb-4">
              Explore the Best Apparel Collection
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl mx-auto mb-6 leading-relaxed">
              Discover premium quality jerseys, stylish t-shirts, and
              fashionable sportswear for every occasion. Authentic designs with
              unmatched comfort.
            </p>
          </div>
        </section>

        <h6 className="flex justify-center mt-10 sm:mt-16">
          <b className="text-3xl sm:text-5xl font-stretch-50% fill-amber-800">
            TOP SELLING !!!
          </b>
        </h6>
        <div className="flex justify-center mt-8">
          <Carousel autoPlay autoPlayInterval={3000} className="w-full">
            <CarouselContent>
              {trending.length > 0 ? (
                trending.map((product, index) => (
                  <CarouselItem 
                    key={product.id} 
                    className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
                    onClick={() => handleBuyNow(product.slug)}
                  >
                    <div className="relative h-48 sm:h-64 w-full cursor-pointer">
                      <Image
                        src={product.image[0] || "/placeholder.webp"}
                        alt={product.title || `Trending Product ${index + 1}`}
                        width={400}
                        height={400}
                        className="h-full w-full object-cover rounded-md"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        priority
                      />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <>
                  <CarouselItem className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                    <Image
                      src="/p1.webp"
                      alt="Product 1"
                      width={400}
                      height={400}
                      className="h-48 sm:h-64 w-full object-cover rounded-md"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      priority
                    />
                  </CarouselItem>
                  <CarouselItem className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                    <Image
                      src="/p2.webp"
                      alt="Product 2"
                      width={400}
                      height={400}
                      className="h-48 sm:h-64 w-full object-cover rounded-md"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      priority
                    />
                  </CarouselItem>
                  <CarouselItem className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                    <Image
                      src="/p3.webp"
                      alt="Product 3"
                      width={400}
                      height={400}
                      className="h-48 sm:h-64 w-full object-cover rounded-md"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      priority
                    />
                  </CarouselItem>
                </>
              )}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2" />
            <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2" />
          </Carousel>
        </div>
        <h6 className="flex justify-center mt-10">
          <b className="text-5xl font-stretch-50% fill-amber-800">
            NEW ARRIVALS !!!
          </b>
        </h6>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mt-8">
          {products.map((product, index) => {
            const outOfStock = isOutOfStock(product);

            return (
              <Card
                key={index}
                className={`p-2 sm:p-4 overflow-hidden cursor-pointer ${
                  outOfStock ? "opacity-90" : ""
                }`}
                onClick={() => handleBuyNow(product.slug)}
              >
                <CardContent className="p-0 sm:p-2">
                  <div className="w-full h-32 sm:h-48 md:h-64 relative overflow-hidden">
                    <Image
                      src={product.image[0] || "/placeholder.webp"}
                      alt={product.title || "Product"}
                      width={1080}
                      height={1080}
                      className={`w-full h-full object-contain ${
                        outOfStock ? "opacity-80 grayscale-[30%]" : ""
                      }`}
                      priority
                    />

                    {outOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black bg-opacity-70 text-white px-3 py-1 text-sm sm:px-4 sm:py-2 sm:text-base font-bold rounded-md transform rotate-[-15deg] shadow-lg">
                          Out of Stock
                        </div>
                      </div>
                    )}
                    
                    {!outOfStock && product.discount && product.discount > 0 && (
                      <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-bl-md">
                        {product.discount_type === 'flat' 
                          ? `৳${product.discount} OFF` 
                          : `${product.discount.toFixed(0)}% OFF`}
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm sm:text-base font-semibold line-clamp-1">
                        {product.title || "Product"}
                      </h3>
                    </div>

                    {(product.price || product.discountPrice) && (
                      <div className="flex items-center space-x-1 text-sm mt-1">
                        {product.discountPrice ? (
                          <>
                            <span className="text-red-500 font-medium">
                              ৳{product.discountPrice}
                            </span>
                            <span className="line-through text-gray-500 text-xs">
                              ৳{product.price}
                            </span>
                          </>
                        ) : product.price ? (
                          <span className="text-gray-700 font-medium">
                            ৳{product.price}
                          </span>
                        ) : null}
                      </div>
                    )}

                    <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                      {product.description || "Description"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Home;
export { Header, Footer };
