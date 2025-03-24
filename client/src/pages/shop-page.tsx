import { useState } from "react";
import CategoryFilter from "@/components/shop/category-filter";
import ProductGrid from "@/components/shop/product-grid";
import { ShoppingBag } from "lucide-react";

export default function ShopPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black">
      {/* Shop header section */}
      <section className="py-16 bg-gradient-to-b from-zinc-900 to-black border-b border-zinc-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-black/30 border border-gold/30">
                <ShoppingBag className="h-8 w-8 text-gold" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-5">
              <span className="text-white">Premium <span className="text-gold">Products</span></span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Browse our exclusive collection of top-quality cannabis products. 
              All products undergo rigorous quality testing to ensure premium standards.
            </p>
          </div>
        </div>
      </section>
      
      {/* Shop content section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-7xl">
            <CategoryFilter 
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
            />
            
            <ProductGrid categoryId={selectedCategoryId} />
          </div>
        </div>
      </section>
    </div>
  );
}
