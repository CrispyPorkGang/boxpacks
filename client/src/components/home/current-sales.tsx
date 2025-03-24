import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function CurrentSales() {
  const { data: sales, isLoading, error } = useQuery({
    queryKey: ["/api/sales/active"],
  });

  // Create array of skeleton cards for loading state
  const skeletonCards = Array(4).fill(0).map((_, index) => (
    <div key={index} className="bg-black/40 border border-zinc-800/50 rounded-md overflow-hidden shadow-lg">
      <div className="relative">
        <Skeleton className="w-full h-64 bg-zinc-800" />
        <div className="absolute top-2 right-2 bg-gold text-black px-3 py-1 font-semibold text-xs uppercase tracking-wider rounded">
          SALE
        </div>
      </div>
      <div className="p-5">
        <Skeleton className="h-6 w-3/4 mb-2 bg-zinc-800" />
        <div className="flex items-center mb-3">
          <Skeleton className="h-6 w-1/4 mr-2 bg-zinc-800" />
          <Skeleton className="h-5 w-1/4 bg-zinc-800" />
        </div>
        <Skeleton className="h-4 w-full mb-2 bg-zinc-800" />
        <Skeleton className="h-4 w-3/4 mb-4 bg-zinc-800" />
        <Skeleton className="h-10 w-full bg-zinc-800" />
      </div>
    </div>
  ));

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Current <span className="text-gold">Sales</span></h2>
          <Link href="/shop" className="text-gold hover:text-gold/80 flex items-center transition-colors">
            View All Products <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        {error ? (
          <div className="text-center py-16">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-red-400 mb-4">Error loading sales: {error.message}</p>
              <Button 
                variant="outline" 
                className="border-zinc-700 hover:border-gold text-zinc-300 hover:text-gold"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              skeletonCards
            ) : sales && sales.length > 0 ? (
              sales.map((sale: any) => (
                <ProductCard 
                  key={sale.product.id}
                  product={{
                    id: sale.product.id,
                    name: sale.product.name,
                    price: sale.product.price,
                    description: sale.product.description,
                    images: sale.product.images,
                    sku: sale.product.sku,
                    weight: sale.product.weight,
                    sale: {
                      discountPercentage: sale.discountPercentage,
                      salePrice: sale.product.price * (1 - sale.discountPercentage / 100)
                    }
                  }}
                  showSaleBadge={true}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 max-w-md mx-auto">
                  <p className="text-lg text-zinc-300 mb-4">No active sales at the moment.</p>
                  <Button
                    className="button-gold"
                    onClick={() => window.location.href = "/shop"}
                  >
                    Browse All Products
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
