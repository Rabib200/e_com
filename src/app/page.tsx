"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
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
import { Link, Menu } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerDescription } from "@/components/ui/drawer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Club Jersey",
    href: '/products?category=club-jersey',
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
  
  return (
    <header className="fixed top-0 left-0 w-full bg-white text-black p-4 md:p-6 z-50 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold">Headgear BD</h1>
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
          <Drawer>
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
                <nav className="space-y-2">
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="home">
                      <AccordionTrigger className="py-2 px-3">Home</AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-4 space-y-2">
                          <Link 
                            href="/" 
                            className="block py-2 px-3 text-sm hover:bg-gray-100 rounded-md"
                          >
                            Home
                          </Link>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="jersey">
                      <AccordionTrigger className="py-2 px-3">JERSEY</AccordionTrigger>
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
                      <AccordionTrigger className="py-2 px-3">T-SHIRTS</AccordionTrigger>
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
                      <AccordionTrigger className="py-2 px-3">TROUSERS</AccordionTrigger>
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
                      <AccordionTrigger className="py-2 px-3">PANTS</AccordionTrigger>
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
                      <AccordionTrigger className="py-2 px-3">WINTER</AccordionTrigger>
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
                      <AccordionTrigger className="py-2 px-3">SNEAKERS</AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-4 space-y-2">
                          {components.slice(15, 18).map((component) => (
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
                      <AccordionTrigger className="py-2 px-3">Contact</AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-4 space-y-2">
                          {components.slice(18).map((component) => (
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
                <NavigationMenuTrigger className="text-black">JERSEY</NavigationMenuTrigger>
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
                <NavigationMenuTrigger className="text-black">T-SHIRTS</NavigationMenuTrigger>
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
                <NavigationMenuTrigger className="text-black">TROUSERS</NavigationMenuTrigger>
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
                <NavigationMenuTrigger className="text-black">PANTS</NavigationMenuTrigger>
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
                <NavigationMenuTrigger className="text-black">WINTER</NavigationMenuTrigger>
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
                <NavigationMenuTrigger className="text-black">SNEAKERS</NavigationMenuTrigger>
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
                <NavigationMenuTrigger className="text-black">Contact</NavigationMenuTrigger>
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
  image: string;
  title: string;
  description: string;
  slug: string;
  category: string;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/products');
        setProducts(response.data);
      }catch(error){
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);
  function handleBuyNow(slug: string) {
    console.log("Buy Now Clicked for product:", slug);
    router.push(`/products/${slug}`);
  } 
    
  

  return (
    <div>
      <Header />
      <main className="p-8 mt-24">
        {" "}
        {/* Adjusted margin-top to avoid content being hidden behind the fixed header */}
        <section className="bg-gray-100 p-6 rounded-lg text-center">
          <Carousel autoPlay autoPlayInterval={5000}>
            <CarouselContent>
              <CarouselItem>
                <Image
                  src="/banner1.webp"
                  alt="Eid Banner"
                  width={2000}
                  height={2000}
                  priority
                />
              </CarouselItem>
              <CarouselItem>
                <Image
                  src="/banner2.webp"
                  alt="Live Now Banner"
                  width={2000}
                  height={2000}
                  priority
                />
              </CarouselItem>
              <CarouselItem>
                <Image
                  src="/banner3.webp"
                  alt="Flash Sale Banner"
                  width={2000}
                  height={2000}
                  priority
                />
              </CarouselItem>
              </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <p className="text-gray-600 text-5xl font-stretch-50% fill-amber-800">
            Explore the best headgear collection
          </p>
          <Button className="mt-4 hover:bg-amber-600">Shop Now</Button>
        </section>
        <h6 className="flex justify-center mt-10">
          <b className="text-5xl font-stretch-50% fill-amber-800">
            TRENDING !!!
          </b>
        </h6>
        <div className="flex justify-center mt-8">
          <Carousel autoPlay autoPlayInterval={3000}>
            <CarouselContent>
              <CarouselItem className="basis-1/5">
                <Image
                  src="/p1.webp"
                  alt="Product 1"
                  width={400}
                  height={400}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </CarouselItem>
              <CarouselItem className="basis-1/5">
                <Image
                  src="/p2.webp"
                  alt="Product 2"
                  width={400}
                  height={400}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </CarouselItem>
              <CarouselItem className="basis-1/5">
                <Image
                  src="/p1.webp"
                  alt="Product 1"
                  width={400}
                  height={400}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </CarouselItem>
              <CarouselItem className="basis-1/5">
                <Image
                  src="/p1.webp"
                  alt="Product 1"
                  width={400}
                  height={400}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </CarouselItem>
              <CarouselItem className="basis-1/5">
                <Image
                  src="/p1.webp"
                  alt="Product 1"
                  width={400}
                  height={400}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </CarouselItem>
              <CarouselItem className="basis-1/5">
                <Image
                  src="/p1.webp"
                  alt="Product 1"
                  width={400}
                  height={400}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </CarouselItem>
              <CarouselItem className="basis-1/5">
                <Image
                  src="/p1.webp"
                  alt="Product 1"
                  width={400}
                  height={400}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </CarouselItem>
              <CarouselItem className="basis-1/5">
                <Image
                  src="/p1.webp"
                  alt="Product 1"
                  width={400}
                  height={400}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </CarouselItem>
              <CarouselItem className="basis-1/5">
                <Image
                  src="/p2.webp"
                  alt="Product 2"
                  width={400}
                  height={400}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </CarouselItem>
              <CarouselItem className="basis-1/5">
                <Image
                  src="/p3.webp"
                  alt="Product 3"
                  width={400}
                  height={400}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </CarouselItem>
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {products.map((product, index) => (
            <Card key={index} className="p-4">
              <CardContent>
                <div className="w-full h-64 relative">
                  <Image
                    src={product.image || "/placeholder.webp"}
                    alt={product.title || "Product"}
                    layout="fill"
                    objectFit="cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                </div>
                <CardTitle>{product.title || "Product"}</CardTitle>
                <p className="text-gray-600">{product.description || "Description"}</p>
                <Button className="mt-4" onClick={() => handleBuyNow(product.slug)}>Buy Now</Button>
              </CardContent>
            </Card>
          ))}
          
          
        </div>
      </main>
    </div>
  );
};

export default Home;
export { Header, Footer };
