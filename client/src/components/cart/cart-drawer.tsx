import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X, ShoppingCart, Trash, Plus, Minus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function CartDrawer() {
  const { state, toggleCart, removeItem, updateQuantity, getTotals, toggleCheckout } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const { subtotal, shipping, cashAppFee, total } = getTotals();

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login or register to proceed with checkout",
        variant: "destructive",
      });
      toggleCart(false);
      return;
    }

    toggleCart(false);
    toggleCheckout(true);
  };

  return (
    <Sheet open={state.isOpen} onOpenChange={toggleCart}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="space-y-0">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-2xl font-bold font-montserrat">Your Cart</SheetTitle>
            <Button variant="ghost" size="icon" onClick={() => toggleCart(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>
        {state.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">Your cart is empty</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => toggleCart(false)}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 my-6 max-h-[calc(100vh-220px)]">
              <div className="space-y-4 pr-4">
                {state.items.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    {item.image && (
                      <div className="w-20 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.name} ({item.weight})</h3>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-red-500"
                          onClick={() => removeItem(item.productId)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-accent font-medium mt-1">{formatCurrency(item.price)}</p>
                      <div className="flex items-center mt-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <div className="h-8 px-4 flex items-center justify-center border-y border-input">
                          {item.quantity}
                        </div>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <Separator className="my-4" />
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span className="font-semibold">{formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Cash App Fee (5%):</span>
                <span className="font-semibold">{formatCurrency(cashAppFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base">
                <span className="font-bold">Total:</span>
                <span className="text-accent font-bold">{formatCurrency(total)}</span>
              </div>
            </div>
            
            <SheetFooter className="mt-6">
              <Button 
                className="w-full bg-accent hover:bg-accent/90 text-primary font-bold border-2 border-primary/20 shadow-md"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
