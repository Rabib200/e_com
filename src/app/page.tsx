import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
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

const Header = () => {
  return (
    <header className="bg-white text-black p-4 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Headgear BD</h1>
      </div>
      <NavigationMenu>
        <NavigationMenuList className="flex gap-6">
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-black">
              Shop
            </NavigationMenuTrigger>
            <NavigationMenuContent className="p-4 bg-white shadow-lg rounded-md">
              <NavigationMenuLink
                href="#"
                className="block p-2 hover:bg-gray-200"
              >
                All Products
              </NavigationMenuLink>
              <NavigationMenuLink
                href="#"
                className="block p-2 hover:bg-gray-200"
              >
                New Arrivals
              </NavigationMenuLink>
              <NavigationMenuLink
                href="#"
                className="block p-2 hover:bg-gray-200"
              >
                Best Sellers
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-black">
              Categories
            </NavigationMenuTrigger>
            <NavigationMenuContent className="p-4 bg-white shadow-lg rounded-md">
              <NavigationMenuLink
                href="#"
                className="block p-2 hover:bg-gray-200"
              >
                Caps
              </NavigationMenuLink>
              <NavigationMenuLink
                href="#"
                className="block p-2 hover:bg-gray-200"
              >
                Hats
              </NavigationMenuLink>
              <NavigationMenuLink
                href="#"
                className="block p-2 hover:bg-gray-200"
              >
                Beanies
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-black">
              Contact
            </NavigationMenuTrigger>
            <NavigationMenuContent className="p-4 bg-white shadow-lg rounded-md">
              <NavigationMenuLink
                href="#"
                className="block p-2 hover:bg-gray-200"
              >
                Customer Support
              </NavigationMenuLink>
              <NavigationMenuLink
                href="#"
                className="block p-2 hover:bg-gray-200"
              >
                FAQ
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-300 text-black p-4 text-center">
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
                <img
                  src="https://headgearbd.com/cdn/shop/files/Eid_Front_Banner_02_2000x2000.jpg?v=1740939035"
                  alt=""
                />
              </CarouselItem>
              <CarouselItem>
                <img
                  src="https://headgearbd.com/cdn/shop/files/Eid25_Live_Now_505e7bd1-48b5-44c6-818e-1c22637e34ef_2000x2000.jpg?v=1742071498"
                  alt=""
                />
              </CarouselItem>
              <CarouselItem>
                <img
                  src="https://headgearbd.com/cdn/shop/files/Flash_Sale_ebb57be9-9ebd-4774-b41c-e65fff2b0aff_2000x2000.jpg?v=1735555276"
                  alt=""
                />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <p className="text-gray-600">Explore the best headgear collection</p>
          <Button className="mt-4 hover:bg-amber-600">Shop Now</Button>
        </section>
        <h6>
          <b className="text-5xl font-stretch-50% fill-amber-800 mt-10">All Products</b>
        </h6>
        <div className="grid grid-cols-1 sm:ßgrid-cols-2 md:grid-cols-3 gap-6 mt-8">
          <Card className="p-4">
            <CardContent>
              <div className="w-[400px]">
                <img
                  src="https://headgearbd.com/cdn/shop/files/IMG_9796_1512x.jpg?v=1742009211"
                  alt=""
                />
              </div>

              <CardTitle>Product 1</CardTitle>
              <p className="text-gray-600">Best quality cap for you</p>
              <Button className="mt-4">Buy Now</Button>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardContent>
              <div className="w-[400px]">
                <img
                  src="https://headgearbd.com/cdn/shop/files/IMG_9796_1512x.jpg?v=1742009211"
                  alt=""
                />
              </div>

              <CardTitle>Product 1</CardTitle>
              <p className="text-gray-600">Best quality cap for you</p>
              <Button className="mt-4">Buy Now</Button>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardContent>
              <div className="w-[400px]">
                <img
                  src="https://headgearbd.com/cdn/shop/files/IMG_9796_1512x.jpg?v=1742009211"
                  alt=""
                />
              </div>

              <CardTitle>Product 1</CardTitle>
              <p className="text-gray-600">Best quality cap for you</p>
              <Button className="mt-4">Buy Now</Button>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardContent>
              <div className="w-[400px]">
                <img
                  src="https://headgearbd.com/cdn/shop/files/IMG_9796_1512x.jpg?v=1742009211"
                  alt=""
                />
              </div>

              <CardTitle>Product 1</CardTitle>
              <p className="text-gray-600">Best quality cap for you</p>
              <Button className="mt-4">Buy Now</Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
