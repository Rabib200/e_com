"use client";
import React, { useEffect, useState } from "react";
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
import { UUID } from "crypto";
import { axiosInstance } from "@/lib/supabase";
import {  useRouter, useSearchParams } from "next/navigation";

interface Product {
  id: UUID;
  slug: string;
  title: string;
  description: string;
  image: string;
  discount?: number;
  discountPrice?: number;
  price: number;
  cagtegory: string;
  sizes: string[];
}

const Products = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const productsPerPage = 6;
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(
          `/products?category=eq.${category}&select=*`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [category]);

  // Calculate the current products to display
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  function handleViewMore(slug: string): void {
    console.log("View more clicked", slug);
    router.push(`/products/${slug}`);
  }

  return (
    <main className="p-8 mt-24">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentProducts.map((product) => (
          <Card key={product.id} className="p-4">
            <CardContent>
              <div className="w-full h-64 relative">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
              <CardTitle>{product.title}</CardTitle>
              <p className="text-gray-600">{product.description}</p>

              <Button
                className="mt-4"
                onClick={() => handleViewMore(product.slug)}
              >
                View More
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationPrevious
            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
          />
          {Array.from(
            { length: Math.ceil(products.length / productsPerPage) },
            (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationNext
            onClick={() =>
              currentPage < Math.ceil(products.length / productsPerPage) &&
              paginate(currentPage + 1)
            }
          />
        </PaginationContent>
      </Pagination>
    </main>
  );
};

export default Products;
