import { useState } from "react";
import CategoryFilter from "@/components/shop/category-filter";
import ProductGrid from "@/components/shop/product-grid";

export default function ShopPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  return (
    <div>
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold font-montserrat mb-2">Shop</h1>
              <p className="text-muted-foreground">
                Browse our premium collection of products
              </p>
            </div>
          </div>
          
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
