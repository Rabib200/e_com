import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

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

const components: { title: string; href: string; description: string }[] = [
  {
    title: "All Products",
    href: "#",
    description: "Browse all available products.",
  },
  {
    title: "New Arrivals",
    href: "#",
    description: "Check out the latest additions to our collection.",
  },
  {
    title: "Best Sellers",
    href: "#",
    description: "Discover our most popular products.",
  },
  {
    title: "Caps",
    href: "#",
    description: "Explore our wide range of caps.",
  },
  {
    title: "Hats",
    href: "#",
    description: "Find the perfect hat for any occasion.",
  },
  {
    title: "Beanies",
    href: "#",
    description: "Stay warm with our stylish beanies.",
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
  return (
    <header className="bg-white text-black p-4 flex justify-between items-center">
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-bold">Headgear BD</h1>
      </div>
      <div className="flex-grow flex justify-center">
        <NavigationMenu>
          <NavigationMenuList className="flex gap-6">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-black">
                Shop
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
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
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-black">
                Categories
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
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
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-black">
                Contact
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  {components.slice(6).map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex-shrink-0"></div>
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
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="text-2xl" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="text-2xl" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="text-2xl" />
        </a>
      </div>
      <p className="mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada.
      </p>
      <p>&copy; {new Date().getFullYear()} Headgear BD Clone</p>
    </footer>
  );
};

const Home = () => {
  return (
    <div>
      <Header />
      <main className="p-8">
        <section className="bg-gray-100 p-6 rounded-lg text-center">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              <CarouselItem>
                <Image
                  src="/banner1.webp"
                  alt="Eid Banner"
                  width={2000} // Define the width
                  height={2000} // Define the height
                  priority // Add priority for LCP optimization
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

          <p className="text-gray-600">Explore the best headgear collection</p>
          <Button className="mt-4 hover:bg-amber-600">Shop Now</Button>
        </section>
        <h6 className="flex justify-center mt-10">
          <b className="text-5xl font-stretch-50% fill-amber-800">
            NEW ARRIVALS !!!
          </b>
        </h6>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          <Card className="p-4">
            <CardContent>
              <div className="w-[400px]">
                <Image
                  src="/p1.webp"
                  alt="Product 1"
                  width={400}
                  height={400}
                  priority
                />
              </div>

              <CardTitle>Product 1</CardTitle>
              <p className="text-gray-600">Best quality cap for you</p>
              <Button className="mt-4">Buy Now</Button>
            </CardContent>
          </Card>
          {/* Repeat the same for other products */}
        </div>
        <h6 className="flex justify-center mt-10">
          <b className="text-5xl font-stretch-50% fill-amber-800">
            TRENDING !!!
          </b>
        </h6>
        <div className="flex justify-center mt-8">
          <Carousel>
            <CarouselContent>
              <CarouselItem className="basis-1/3">
                <Image
                  src="/p1.webp"
                  alt="Product 1"
                  width={400}
                  height={400}
                  priority
                />
              </CarouselItem>
              <CarouselItem className="basis-1/3">
                <Image
                  src="/p1.webp"
                  alt="Product 1"
                  width={400}
                  height={400}
                  priority
                />
              </CarouselItem>
              <CarouselItem className="basis-1/3">
                <Image
                  src="/p1.webp"
                  alt="Product 1"
                  width={400}
                  height={400}
                  priority
                />
              </CarouselItem>
              <CarouselItem className="basis-1/3">
                <Image
                  src="/p1.webp"
                  alt="Product 1"
                  width={400}
                  height={400}
                  priority
                />
              </CarouselItem>
              <CarouselItem className="basis-1/3">
                <Image
                  src="/p1.webp"
                  alt="Product 1"
                  width={400}
                  height={400}
                  priority
                />
              </CarouselItem>
              <CarouselItem className="basis-1/3">
                <Image
                  src="/p1.webp"
                  alt="Product 1"
                  width={400}
                  height={400}
                  priority
                />
              </CarouselItem>
              <CarouselItem className="basis-1/3">
                <Image
                  src="/p1.webp"
                  alt="Product 1"
                  width={400}
                  height={400}
                  priority
                />
              </CarouselItem>
              <CarouselItem className="basis-1/3">
                <Image
                  src="/p1.webp"
                  alt="Product 1"
                  width={400}
                  height={400}
                  priority
                />
              </CarouselItem>
              <CarouselItem className="basis-1/3">
                <Image
                  src="/p1.webp"
                  alt="Product 1"
                  width={400}
                  height={400}
                  priority
                />
              </CarouselItem>
              <CarouselItem className="basis-1/3">
                <Image
                  src="/p1.webp"
                  alt="Product 1"
                  width={400}
                  height={400}
                  priority
                />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2" />
            <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2" />
          </Carousel>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
