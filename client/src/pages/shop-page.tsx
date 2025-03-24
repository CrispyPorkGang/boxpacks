import { useState } from "react";
import CategoryFilter from "@/components/shop/category-filter";
import ProductGrid from "@/components/shop/product-grid";

export default function ShopPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black">
      {/* Shop header section */}
      <section className="bg-zinc-900 py-16 border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gold-gradient">Premium Products</span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Browse our exclusive collection of top-quality cannabis products. 
              All products undergo rigorous quality testing to ensure premium standards.
            </p>
          </div>
        </div>
      </section>
      
      {/* Shop content section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <CategoryFilter 
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
          
          <ProductGrid categoryId={selectedCategoryId} />
        </div>
      </section>
    </div>
  );
}
