import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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
      className={`h-10 w-${index === 0 ? '32' : '24'} rounded-md bg-zinc-800`} 
    />
  ));

  if (error) {
    return (
      <div className="mb-10 border-b border-zinc-800 pb-6">
        <h2 className="text-xl font-bold mb-4 text-zinc-100">Categories</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            variant={selectedCategoryId === null ? "default" : "outline"}
            className={selectedCategoryId === null 
              ? "button-gold" 
              : "border-zinc-700 hover:border-primary text-zinc-200 hover:text-primary"}
            onClick={() => onSelectCategory(null)}
          >
            All Products
          </Button>
          <div className="text-red-500 ml-2 flex items-center">
            Error loading categories: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10 border-b border-zinc-800 pb-6">
      <h2 className="text-xl font-bold mb-4 text-zinc-100">Categories</h2>
      <div className="flex flex-wrap gap-3">
        {isLoading ? (
          skeletonButtons
        ) : (
          <>
            <Button
              variant={selectedCategoryId === null ? "default" : "outline"}
              className={selectedCategoryId === null 
                ? "button-gold" 
                : "border-zinc-700 hover:border-primary text-zinc-200 hover:text-primary"}
              onClick={() => onSelectCategory(null)}
            >
              All Products
            </Button>
            
            {categories && categories.map((category: any) => (
              <Button
                key={category.id}
                variant={selectedCategoryId === category.id ? "default" : "outline"}
                className={selectedCategoryId === category.id 
                  ? "button-gold" 
                  : "border-zinc-700 hover:border-primary text-zinc-200 hover:text-primary"}
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
