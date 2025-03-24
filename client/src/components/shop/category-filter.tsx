import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag } from "lucide-react";

interface CategoryFilterProps {
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

export default function CategoryFilter({ 
  selectedCategoryId, 
  onSelectCategory
}: CategoryFilterProps) {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ["/api/categories"],
  });

  // Create array of skeleton buttons for loading state
  const skeletonButtons = Array(5).fill(0).map((_, index) => (
    <Skeleton 
      key={index} 
      className={`h-12 w-${index === 0 ? '40' : '28'} rounded-md bg-zinc-800`} 
    />
  ));

  if (error) {
    return (
      <div className="mb-10 pb-8 border-b border-zinc-800/60">
        <div className="flex items-center gap-2 mb-6">
          <Tag className="h-5 w-5 text-gold" />
          <h2 className="text-2xl font-medium text-zinc-100">Categories</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant={selectedCategoryId === null ? "default" : "outline"}
            className={selectedCategoryId === null 
              ? "button-gold h-11 px-5 rounded-md" 
              : "border-zinc-700 hover:border-primary text-zinc-400 hover:text-primary h-11 px-5 rounded-md bg-black/20"}
            onClick={() => onSelectCategory(null)}
          >
            All Products
          </Button>
          <div className="text-red-400 ml-2 flex items-center text-sm">
            Error loading categories: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10 pb-8 border-b border-zinc-800/60">
      <div className="flex items-center gap-2 mb-6">
        <Tag className="h-5 w-5 text-gold" />
        <h2 className="text-2xl font-medium text-zinc-100">Categories</h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {isLoading ? (
          skeletonButtons
        ) : (
          <>
            <Button
              variant={selectedCategoryId === null ? "default" : "outline"}
              className={selectedCategoryId === null 
                ? "button-gold h-11 px-5 rounded-md" 
                : "border-zinc-700 hover:border-primary text-zinc-400 hover:text-primary h-11 px-5 rounded-md bg-black/20"}
              onClick={() => onSelectCategory(null)}
            >
              All Products
            </Button>
            
            {categories && categories.map((category: any) => (
              <Button
                key={category.id}
                variant={selectedCategoryId === category.id ? "default" : "outline"}
                className={selectedCategoryId === category.id 
                  ? "button-gold h-11 px-5 rounded-md" 
                  : "border-zinc-700 hover:border-primary text-zinc-400 hover:text-primary h-11 px-5 rounded-md bg-black/20"}
                onClick={() => onSelectCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
