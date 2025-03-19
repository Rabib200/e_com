'use client';
import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

const products = [
  { id: 1, title: "Product 1", description: "Best quality cap for you", image: "/p1.webp", href: "/products/product-1" },
  { id: 2, title: "Product 2", description: "Best quality hat for you", image: "/p2.webp", href: "/products/product-2" },
  { id: 3, title: "Product 3", description: "Best quality beanie for you", image: "/p3.webp", href: "/products/product-3" },
  // Add more products as needed
];

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Calculate the current products to display
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <main className="p-8 mt-24">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentProducts.map((product) => (
          <Card key={product.id} className="p-4">
            <CardContent>
              <div className="w-full h-64 relative">
                <Image src={product.image} alt={product.title} fill style={{ objectFit: "cover" }} priority />
              </div>
              <CardTitle>{product.title}</CardTitle>
              <p className="text-gray-600">{product.description}</p>
              <Link href={product.href} passHref>
                <Button className="mt-4">View More</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationPrevious
            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
          />
          {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={currentPage === i + 1}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationNext
            onClick={() => currentPage < Math.ceil(products.length / productsPerPage) && paginate(currentPage + 1)}
          />
        </PaginationContent>
      </Pagination>
    </main>
  );
};

export default Products;