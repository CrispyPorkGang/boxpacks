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
    <div className="card-product rounded-md overflow-hidden group">
      <div className="relative overflow-hidden">
        <img 
          src={featuredImage}
          alt={product.name} 
          className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-300" 
        />
        
        {showSaleBadge && product.sale && (
          <div className="absolute top-0 right-0 bg-primary text-black px-3 py-1 m-2 font-bold text-sm rounded-sm">
            {product.sale.discountPercentage}% OFF
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold mb-1.5 text-zinc-100">{product.name}</h3>
        
        <div className="flex items-center mb-2">
          {product.sale ? (
            <>
              <span className="text-lg font-bold text-primary mr-2">
                {formatCurrency(product.sale.salePrice)}
              </span>
              <span className="text-zinc-500 line-through text-sm">
                {formatCurrency(product.price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-primary">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
        
        <div className="text-zinc-400 text-sm mb-4">
          {product.description || `${product.weight} package • SKU: ${product.sku}`}
        </div>
        
        <Button 
          onClick={handleAddToCart}
          className="w-full button-gold transition"
          disabled={isAdding}
        >
          {isAdding ? (
            <>
              <Check className="mr-2 h-4 w-4" /> Added
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
