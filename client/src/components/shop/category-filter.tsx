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
      className={`h-10 w-${index === 0 ? '32' : '24'} rounded-md`} 
    />
  ));

  if (error) {
    return (
      <div className="mb-8 flex flex-wrap gap-3">
        <Button
          variant={selectedCategoryId === null ? "default" : "secondary"}
          className={selectedCategoryId === null ? "bg-accent text-primary" : ""}
          onClick={() => onSelectCategory(null)}
        >
          All Products
        </Button>
        <div className="text-red-500 ml-2 flex items-center">
          Error loading categories: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 flex flex-wrap gap-3">
      {isLoading ? (
        skeletonButtons
      ) : (
        <>
          <Button
            variant={selectedCategoryId === null ? "default" : "secondary"}
            className={selectedCategoryId === null ? "bg-accent text-primary" : ""}
            onClick={() => onSelectCategory(null)}
          >
            All Products
          </Button>
          
          {categories && categories.map((category: any) => (
            <Button
              key={category.id}
              variant={selectedCategoryId === category.id ? "default" : "secondary"}
              className={selectedCategoryId === category.id ? "bg-accent text-primary" : ""}
              onClick={() => onSelectCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </>
      )}
    </div>
  );
}
