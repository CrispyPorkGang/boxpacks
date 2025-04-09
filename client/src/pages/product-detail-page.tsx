import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";
import NotFound from "./not-found";
import { formatCurrency } from "@/lib/utils";

export default function ProductDetailPage() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : null;

  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Fetch the product data
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });
  
  // Get active sale from api if it exists
  const { data: activeSales } = useQuery<any[]>({
    queryKey: ["/api/sales/active"],
  });

  // Set the first image as selected by default when product loads
  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    }
    if (product?.videos && product.videos.length > 0) {
      setSelectedVideo(product.videos[0]);
    }
  }, [product]);

  // Handle "Add to Cart" action
  const handleAddToCart = () => {
    if (product) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        sku: product.sku,
        weight: product.weight || "N/A",
        image: product.images && product.images.length > 0 ? product.images[0] : '',
        quantity: 1,
      });
    }
  };

  // Handle image selection
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setShowVideo(false);
  };

  // Handle video selection
  const handleVideoClick = (video: string) => {
    setSelectedVideo(video);
    setShowVideo(true);
  };

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto py-16 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return <NotFound />;
  }

  // Find if this product has an active sale
  const activeSale = activeSales?.find(sale => sale.productId === product.id);
  
  // Calculate discount price if there's an active sale
  const discountedPrice = activeSale 
    ? product.price * (1 - activeSale.discountPercentage / 100) 
    : null;

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-background border border-border rounded-lg overflow-hidden">
            {showVideo && selectedVideo ? (
              <video 
                src={selectedVideo} 
                controls 
                className="w-full h-full object-contain"
              />
            ) : (
              <img 
                src={selectedImage || ''} 
                alt={product.name} 
                className="w-full h-full object-contain" 
              />
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex flex-wrap gap-2">
            {/* Image thumbnails */}
            {product.images && product.images.map((image, index) => (
              <button
                key={`image-${index}`}
                onClick={() => handleImageClick(image)}
                className={`w-16 h-16 border rounded-md overflow-hidden ${
                  selectedImage === image && !showVideo ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'border-border'
                }`}
              >
                <img 
                  src={image} 
                  alt={`${product.name} thumbnail ${index + 1}`} 
                  className="w-full h-full object-cover" 
                />
              </button>
            ))}

            {/* Video thumbnails */}
            {product.videos && product.videos.map((video, index) => (
              <button
                key={`video-${index}`}
                onClick={() => handleVideoClick(video)}
                className={`w-16 h-16 border rounded-md overflow-hidden ${
                  showVideo && selectedVideo === video ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'border-border'
                } relative group`}
              >
                <video 
                  src={video} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white h-6 w-6"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">{product.name}</h1>
            <div className="flex items-baseline gap-2 mb-4">
              {discountedPrice ? (
                <>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(discountedPrice)}
                  </span>
                  <span className="text-lg line-through text-muted-foreground">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm font-semibold">
                    {activeSale?.discountPercentage}% OFF
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-primary">Description</h2>
            <p className="text-muted-foreground whitespace-pre-line">
              {product.description || "No description available."}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 border-t border-border pt-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground block">SKU</span>
              <span>{product.sku}</span>
            </div>
            {product.weight && (
              <div>
                <span className="text-sm font-medium text-muted-foreground block">Weight</span>
                <span>{product.weight}</span>
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-muted-foreground block">Category</span>
              <span>{"Uncategorized"}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground block">Availability</span>
              <div className={`inline-flex items-center rounded text-sm font-medium ${
                product.inventory > 10 
                  ? 'text-emerald-400' 
                  : product.inventory > 0 
                    ? 'text-amber-400' 
                    : 'text-red-400'
              }`}>
                {product.inventory > 0 
                  ? `${product.inventory} in stock` 
                  : 'Out of stock'}
              </div>
            </div>
          </div>

          <Button 
            size="lg" 
            onClick={handleAddToCart}
            disabled={!product.inventory || product.inventory <= 0}
            className="w-full md:w-auto button-gold border-2 border-gold/30 shadow-md"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}