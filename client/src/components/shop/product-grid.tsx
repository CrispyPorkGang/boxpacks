import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGridProps {
  categoryId?: number | null;
}

export default function ProductGrid({ categoryId }: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Query for products, with optional category filter
  const queryUrl = categoryId 
    ? `/api/products?categoryId=${categoryId}` 
    : "/api/products";
    
  const { data: products, isLoading, error } = useQuery({
    queryKey: [queryUrl],
  });

  // Create array of skeleton cards for loading state
  const skeletonCards = Array(8).fill(0).map((_, index) => (
    <div key={index} className="card-product rounded-md overflow-hidden">
      <div className="relative">
        <Skeleton className="w-full h-64 bg-zinc-800" />
      </div>
      <div className="p-5">
        <Skeleton className="h-6 w-3/4 mb-2 bg-zinc-800" />
        <Skeleton className="h-5 w-1/4 mb-3 bg-zinc-800" />
        <Skeleton className="h-4 w-full mb-2 bg-zinc-800" />
        <Skeleton className="h-4 w-3/4 mb-4 bg-zinc-800" />
        <Skeleton className="h-10 w-full bg-zinc-800" />
      </div>
    </div>
  ));

  // Pagination logic
  const totalProducts = products?.length || 0;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  
  const paginatedProducts = products?.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of product grid
    window.scrollTo({ top: document.getElementById('product-grid')?.offsetTop || 0, behavior: 'smooth' });
  };

  return (
    <div id="product-grid">
      {error ? (
        <div className="text-center py-12">
          <p className="text-red-500">Error loading products: {error.message}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              skeletonCards
            ) : paginatedProducts && paginatedProducts.length > 0 ? (
              paginatedProducts.map((product: any) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  showSaleBadge={!!product.sale}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 max-w-md mx-auto">
                  <p className="text-xl text-zinc-300 mb-2">
                    {categoryId 
                      ? "No products found in this category." 
                      : "No products available at this time."}
                  </p>
                  <p className="text-zinc-500">
                    Please check back later or try another category.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <nav className="inline-flex space-x-1.5">
                <Button 
                  variant="outline"
                  size="icon"
                  className="border-zinc-700 hover:border-primary text-zinc-400 hover:text-primary rounded-md"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    className={currentPage === page 
                      ? 'button-gold rounded-md' 
                      : 'border-zinc-700 hover:border-primary text-zinc-400 hover:text-primary rounded-md'}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
                
                <Button 
                  variant="outline"
                  size="icon"
                  className="border-zinc-700 hover:border-primary text-zinc-400 hover:text-primary rounded-md"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}
