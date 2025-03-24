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
    <div key={index} className="bg-secondary rounded-lg overflow-hidden shadow-lg">
      <div className="relative">
        <Skeleton className="w-full h-64" />
        <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 m-2 rounded font-medium">
          SALE
        </div>
      </div>
      <div className="p-4">
        <Skeleton className="h-7 w-3/4 mb-2" />
        <div className="flex items-center mb-3">
          <Skeleton className="h-6 w-1/4 mr-2" />
          <Skeleton className="h-5 w-1/4" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  ));

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold font-montserrat">Current Sales</h2>
          <Link href="/shop">
            <a className="text-accent hover:underline flex items-center">
              View All Products <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Link>
        </div>
        
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading sales: {error.message}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
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
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-muted-foreground">No active sales at the moment.</p>
                <Link href="/shop">
                  <Button variant="outline" className="mt-4">
                    Browse All Products
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
