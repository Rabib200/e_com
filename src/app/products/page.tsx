"use client";
import React, { Suspense, useEffect, useState } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: UUID;
  slug: string;
  title: string;
  description: string;
  image?: string[] | null;
  discount?: number; // Now a float
  discount_type?: string; // New field: could be "percentage" or "fixed" or other types
  discountPrice?: number;
  price: number;
  category: string;
  sizes: string[];
  status?: string; // Add status field to handle out of stock
}

const SkeletonCard = () => (
  <Card className="p-4">
    <CardContent>
      <Skeleton className="w-full h-64 mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <Skeleton className="h-10 w-24" />
    </CardContent>
  </Card>
);

const ProductsContent = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const productsPerPage = 6;
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let query = `/products?isAvailable=eq.true`;
        
        // Add category filter if provided
        if (category) {
          query += `&category=eq.${category}`;
        }
        
        const response = await axiosInstance.get(`${query}&select=*`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <main className="p-8 mt-24">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: productsPerPage }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : currentProducts.map((product) => (
              <Card key={product.id} className="p-4">
                <CardContent>
                  <div className="w-full h-64 relative">
                    {product.image?.[0] && (
                      <>
                        <Image
                          src={product.image[0]}
                          alt={product.title}
                          width={1080}
                          height={1080}
                          className={`w-full h-full object-contain ${product.status === "Out_of_Stock" ? "opacity-80 grayscale-[30%]" : ""}`}
                          priority
                        />
                        
                        {/* Out of Stock Overlay */}
                        {product.status === "Out_of_Stock" && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black bg-opacity-70 text-white px-3 py-1 text-sm sm:px-4 sm:py-2 sm:text-base font-bold rounded-md transform rotate-[-15deg] shadow-lg">
                              Out of Stock
                            </div>
                          </div>
                        )}
                        
                        {/* Discount Label */}
                        {product.status !== "Out_of_Stock" && product.discount && product.discount > 0 && (
                          <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-bl-md">
                            {product.discount_type === 'flat' 
                              ? `৳${product.discount} OFF` 
                              : `${product.discount.toFixed(0)}% OFF`}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <CardTitle>{product.title}</CardTitle>
                  <p className="text-gray-600">{product.description}</p>
                  <Button
                    className="mt-4"
                    onClick={() => router.push(`/products/${product.slug}`)}
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

const Products = () => {
  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
};

export default Products;
