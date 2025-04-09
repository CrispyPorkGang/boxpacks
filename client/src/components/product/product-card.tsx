import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Check, ShoppingCart, Eye } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Link } from "wouter";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    description?: string;
    images?: string[];
    sku: string;
    weight: string;
    inventory?: number;
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
    <div className="card-product rounded-md overflow-hidden group bg-black/20 border border-zinc-800/50 hover:border-gold/40 transition-all">
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.id}`} className="block">
          <img 
            src={featuredImage}
            alt={product.name} 
            className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-300" 
          />
        </Link>
        
        {showSaleBadge && product.sale && (
          <div className="absolute top-2 right-2 bg-gold text-black px-3 py-1 font-semibold text-xs uppercase tracking-wider rounded">
            {product.sale.discountPercentage}% OFF
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start">
          <Link to={`/product/${product.id}`}>
            <h3 className="text-lg font-semibold mb-2 text-zinc-100 hover:text-gold transition-colors">{product.name}</h3>
          </Link>
          
          {typeof product.inventory === 'number' && (
            <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
              product.inventory > 10 
                ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-900/50' 
                : product.inventory > 0 
                  ? 'bg-amber-900/30 text-amber-400 border border-amber-900/50' 
                  : 'bg-red-900/30 text-red-400 border border-red-900/50'
            }`}>
              {product.inventory > 0 
                ? `${product.inventory} in stock` 
                : 'Out of stock'}
            </div>
          )}
        </div>
        
        <div className="flex items-baseline mb-2">
          {product.sale ? (
            <>
              <span className="text-xl font-bold text-gold mr-2">
                {formatCurrency(product.sale.salePrice)}
              </span>
              <span className="text-zinc-500 line-through text-sm">
                {formatCurrency(product.price)}
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-gold">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
        
        <div className="text-zinc-400 text-sm mb-5 leading-relaxed">
          {product.description || `${product.weight} package • SKU: ${product.sku}`}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline"
            className="w-full h-11 border-2 border-gold/30 text-gold hover:bg-gold/10 hover:text-gold shadow-md"
            onClick={() => window.location.href = `/product/${product.id}`}
          >
            <Eye className="mr-2 h-4 w-4" /> View Details
          </Button>
          
          <Button 
            onClick={handleAddToCart}
            className={`w-full ${
              isAdding 
                ? 'bg-emerald-900 hover:bg-emerald-900 text-emerald-100' 
                : typeof product.inventory === 'number' && product.inventory <= 0
                  ? 'bg-zinc-800 hover:bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'button-gold border-2 border-gold/30'
            } h-11 transition-all duration-200 shadow-md`}
            disabled={isAdding || (typeof product.inventory === 'number' && product.inventory <= 0)}
          >
            {isAdding ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Added
              </>
            ) : typeof product.inventory === 'number' && product.inventory <= 0 ? (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" /> Out of Stock
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
