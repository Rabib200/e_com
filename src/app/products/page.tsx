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
  const search = searchParams.get("search") || "";
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

        // Fix search query format
        if(search) {
          // Properly encode the search parameter for Supabase
          query += `&or=(title.ilike.*${encodeURIComponent(search)}*)`;
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
  }, [category, search]); // Also add search as a dependency

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-7xl mx-auto p-4 mt-32 sm:mt-36">
      <h1 className="text-3xl font-bold mb-8">
        {search ? `Search Results for "${search}"` : 'All Products'}
        {category ? ` - ${category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}` : ''}
      </h1>
      
      {loading ? (
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
            {Array.from({ length: productsPerPage }).map((_, i) => (
              <SkeletonCard key={i} className="w-full" />
            ))}
          </div>
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
              {currentProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200 w-full"
                  onClick={() => router.push(`/products/${product.slug}`)}
                >
                  <CardContent className="p-4 flex flex-col h-full">
                    <div className="w-full h-64 relative mb-3 flex-shrink-0">
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
                    <div className="flex-grow flex flex-col">
                      <CardTitle className="mb-2 line-clamp-2 text-lg">{product.title}</CardTitle>
                      <p className="text-gray-600 mb-3 line-clamp-2 text-sm flex-grow">{product.description}</p>
                      <div className="mt-auto">
                        <div className="flex items-center mb-3">
                          {product.discountPrice ? (
                            <>
                              <span className="text-red-500 font-medium mr-2">৳{product.discountPrice}</span>
                              <span className="line-through text-gray-400 text-sm">৳{product.price}</span>
                            </>
                          ) : (
                            <span className="font-medium">৳{product.price}</span>
                          )}
                        </div>
                        <Button
                          className="w-full bg-amber-600 hover:bg-amber-700"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationPrevious
                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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
                className={currentPage >= Math.ceil(products.length / productsPerPage) ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationContent>
          </Pagination>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="bg-gray-100 p-8 rounded-lg shadow-md text-center w-full max-w-lg">
            <svg 
              className="w-16 h-16 mx-auto text-gray-400 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h2 className="text-xl font-bold text-gray-700 mb-2">No Products Found</h2>
            {search && (
              <p className="text-gray-600 mb-4">
                No products match your search for &quot;<span className="font-semibold">{search}</span>&quot;
              </p>
            )}
            {category && (
              <p className="text-gray-600 mb-4">
                No products available in the category &quot;<span className="font-semibold">
                  {category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>&quot;
              </p>
            )}
            {!search && !category && (
              <p className="text-gray-600 mb-4">
                There are no products available at the moment.
              </p>
            )}
            <Button 
              onClick={() => router.push('/')}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Back to Home
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const Products = () => {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
};

export default Products;
