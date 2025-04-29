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
import { Menu } from "lucide-react";
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
    description: "Get the latest headgear accessories.",
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
    description: "Get the latest headgear accessories.",
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

  // Cart loading logic
  useEffect(() => {
    try {
      const getCart = JSON.parse(localStorage.getItem("cart") || "[]");

      if (getCart && Array.isArray(getCart)) {
        // If each item has a quantity property, sum up all quantities
        if (getCart.length > 0 && "quantity" in getCart[0]) {
          const totalItems = getCart.reduce(
            (total, item) => total + (item.quantity || 1),
            0
          );
          setCartItems(totalItems);
        } else {
          // Otherwise, just count the number of items in the cart
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

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Add a function to close the drawer
  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white text-black p-4 md:p-6 z-50 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold">
            <Link href={"/"}>Headgear BD</Link>
          </h1>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-4 md:hidden">
          {/* Cart Icon for Mobile */}
          <div className="relative">
            <FaShoppingCart
              className="text-black text-2xl cursor-pointer"
              onClick={toggleCart}
            />
            {cartItems > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartItems}
              </span>
            )}
          </div>

          {/* Hamburger Menu */}
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[85vh]">
              <DrawerHeader className="border-b">
                <DrawerTitle>Menu</DrawerTitle>
                {/* Add this DrawerDescription to fix the accessibility warning */}
                <DrawerDescription>
                  Browse our navigation menu
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-4 py-2 overflow-y-auto">
                <nav className="space-y-4">
                  <Link
                    href="/"
                    onClick={closeDrawer}
                    className="block py-3 px-4 text-lg font-medium text-black hover:bg-gray-100 rounded-md border border-gray-200"
                  >
                    Home
                  </Link>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="jersey">
                      <AccordionTrigger className="py-2 px-3">
                        JERSEY
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-4 space-y-2">
                          {components.slice(0, 3).map((component) => (
                            <a
                              key={component.title}
                              href={component.href}
                              className="block py-2 px-3 text-sm hover:bg-gray-100 rounded-md"
                            >
                              {component.title}
                            </a>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="tshirts">
                      <AccordionTrigger className="py-2 px-3">
                        T-SHIRTS
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-4 space-y-2">
                          {components.slice(3, 6).map((component) => (
                            <a
                              key={component.title}
                              href={component.href}
                              className="block py-2 px-3 text-sm hover:bg-gray-100 rounded-md"
                            >
                              {component.title}
                            </a>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="trousers">
                      <AccordionTrigger className="py-2 px-3">
                        TROUSERS
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-4 space-y-2">
                          {components.slice(6, 9).map((component) => (
                            <a
                              key={component.title}
                              href={component.href}
                              className="block py-2 px-3 text-sm hover:bg-gray-100 rounded-md"
                            >
                              {component.title}
                            </a>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="pants">
                      <AccordionTrigger className="py-2 px-3">
                        PANTS
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-4 space-y-2">
                          {components.slice(9, 12).map((component) => (
                            <a
                              key={component.title}
                              href={component.href}
                              className="block py-2 px-3 text-sm hover:bg-gray-100 rounded-md"
                            >
                              {component.title}
                            </a>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="winter">
                      <AccordionTrigger className="py-2 px-3">
                        WINTER
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-4 space-y-2">
                          {components.slice(12, 15).map((component) => (
                            <a
                              key={component.title}
                              href={component.href}
                              className="block py-2 px-3 text-sm hover:bg-gray-100 rounded-md"
                            >
                              {component.title}
                            </a>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="sneakers">
                      <AccordionTrigger className="py-2 px-3">
                        SNEAKERS
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-4 space-y-2">
                          {components.slice(15, 17).map((component) => (
                            <a
                              key={component.title}
                              href={component.href}
                              className="block py-2 px-3 text-sm hover:bg-gray-100 rounded-md"
                            >
                              {component.title}
                            </a>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="contact">
                      <AccordionTrigger className="py-2 px-3">
                        Contact
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-4 space-y-2">
                          {components.slice(17).map((component) => (
                            <a
                              key={component.title}
                              href={component.href}
                              className="block py-2 px-3 text-sm hover:bg-gray-100 rounded-md"
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

          {/* Mobile cart dropdown */}
          {isCartOpen && (
            <div className="absolute top-16 right-4 w-48 bg-white shadow-lg rounded-lg p-4 z-50">
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

        {/* Desktop Navigation - Hidden on Mobile */}
        <div className="hidden md:flex flex-grow justify-center">
          <NavigationMenu viewport={false} className="relative">
            <NavigationMenuList className="flex flex-wrap gap-2 md:gap-4">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/"
                  className="block py-2 px-3 text-black font-bold hover:bg-gray-100 rounded-md"
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-black">
                  JERSEY
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] lg:w-[500px] p-4">
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
                <NavigationMenuTrigger className="text-black">
                  T-SHIRTS
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] lg:w-[500px] p-4">
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
                <NavigationMenuTrigger className="text-black">
                  TROUSERS
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] lg:w-[500px] p-4">
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
                <NavigationMenuTrigger className="text-black">
                  PANTS
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] lg:w-[500px] p-4">
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
                <NavigationMenuTrigger className="text-black">
                  WINTER
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] lg:w-[500px] p-4">
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
                <NavigationMenuTrigger className="text-black">
                  SNEAKERS
                </NavigationMenuTrigger>
                <NavigationMenuContent className="right-0 left-auto">
                  <div className="w-[400px] lg:w-[500px] p-4">
                    <ul className="grid gap-3 lg:grid-cols-2">
                      {components.slice(15, 18).map((component) => (
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
                <NavigationMenuTrigger className="text-black">
                  Contact
                </NavigationMenuTrigger>
                <NavigationMenuContent className="right-0 left-auto">
                  <div className="w-[400px] lg:w-[500px] p-4">
                    <ul className="grid gap-3 lg:grid-cols-2">
                      {components.slice(18).map((component) => (
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

        {/* Desktop Cart - Hidden on Mobile */}
        <div className="hidden md:block">
          <div className="relative">
            <FaShoppingCart
              className="text-black text-2xl cursor-pointer"
              onClick={toggleCart}
            />
            {cartItems > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartItems}
              </span>
            )}
            {isCartOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-4 z-50">
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
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
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
    <footer className="bg-gray-300 text-black p-4 text-center">
      <div className="mb-4">
        <p>Contact us: +123 456 7890</p>
        <p>Address: 123 Headgear St, Dhaka, Bangladesh</p>
      </div>
      <div className="flex justify-center space-x-4 mb-4">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook className="text-2xl" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="text-2xl" />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram className="text-2xl" />
        </a>
      </div>
      <p className="mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia
        odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada.
      </p>
      <p>&copy; {new Date().getFullYear()} Headgear BD Clone</p>
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
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products");
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
        const response = await axiosInstance.get("/products?isTrending=eq.true");
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

  // Function to check if a product is out of stock - only use status field
  const isOutOfStock = (product: Product) => {
    return product.status === "Out_of_Stock";
  };

  return (
    <div>
      <Header />
      <main className="p-4 sm:p-8 mt-24">
        {/* Hero Section with Enhanced Carousel and Text */}
        <section className="bg-gradient-to-br from-gray-50 to-gray-200 p-4 sm:p-6 rounded-lg shadow-md">
          {/* Larger Carousel for Mobile */}
          <div className="mb-6 sm:mb-8">
            <Carousel autoPlay autoPlayInterval={5000} className="w-full">
              <CarouselContent>
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

          {/* Enhanced and Responsive Text */}
          <div className="text-center px-3 py-6 sm:py-8 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800 mb-4">
              Explore the Best Headgear Collection
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl mx-auto mb-6 leading-relaxed">
              Discover premium quality jerseys, stylish t-shirts, and
              fashionable sportswear for every occasion. Authentic designs with
              unmatched comfort.
            </p>
            <Button className="px-6 py-3 bg-amber-600 hover:bg-amber-700 transition-all duration-300 text-white text-base sm:text-lg rounded-md shadow-md hover:shadow-lg transform hover:-translate-y-1">
              Shop Now
            </Button>
          </div>
        </section>

        <h6 className="flex justify-center mt-10 sm:mt-16">
          <b className="text-3xl sm:text-5xl font-stretch-50% fill-amber-800">
            TRENDING !!!
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
                // Fallback images if no trending products are loaded
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
                      width={400}
                      height={400}
                      className={`w-full h-full object-cover ${
                        outOfStock ? "opacity-80 grayscale-[30%]" : ""
                      }`}
                      priority
                    />

                    {/* Out of Stock Overlay */}
                    {outOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black bg-opacity-70 text-white px-3 py-1 text-sm sm:px-4 sm:py-2 sm:text-base font-bold rounded-md transform rotate-[-15deg] shadow-lg">
                          Out of Stock
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm sm:text-base font-semibold line-clamp-1">
                        {product.title || "Product"}
                      </h3>
                      {outOfStock && (
                        <span className="px-1.5 py-0.5 bg-red-600 text-white text-[10px] sm:text-xs font-medium rounded">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Price Display */}
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
