import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Check, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    description?: string;
    images?: string[];
    sku: string;
    weight: string;
    sale?: {
      discountPercentage: number;
      salePrice: number;
    };
  };
  showSaleBadge?: boolean;
}

export function ProductCard({ product, showSaleBadge = false }: ProductCardProps) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.sale ? product.sale.salePrice : product.price,
      quantity: 1,
      sku: product.sku,
      weight: product.weight,
      image: product.images?.[0] || undefined
    });

    // Show added confirmation
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };

  const featuredImage = product.images?.[0] || "https://placehold.co/600x400?text=No+Image";

  return (
    <div className="bg-secondary rounded-lg overflow-hidden shadow-lg group">
      <div className="relative overflow-hidden">
        <img 
          src={featuredImage}
          alt={product.name} 
          className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500" 
        />
        
        {showSaleBadge && product.sale && (
          <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 m-2 rounded font-medium">
            SALE {product.sale.discountPercentage}% OFF
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
        
        <div className="flex items-center mb-3">
          {product.sale ? (
            <>
              <span className="text-lg font-bold text-accent mr-2">
                {formatCurrency(product.sale.salePrice)}
              </span>
              <span className="text-gray-400 line-through">
                {formatCurrency(product.price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-accent">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
        
        <p className="text-gray-300 text-sm mb-4">
          {product.description || `${product.weight} package. SKU: ${product.sku}`}
        </p>
        
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-accent hover:bg-accent/90 text-primary font-medium transition transform hover:scale-105"
          disabled={isAdding}
        >
          {isAdding ? (
            <>
              <Check className="mr-2 h-4 w-4" /> Added!
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
