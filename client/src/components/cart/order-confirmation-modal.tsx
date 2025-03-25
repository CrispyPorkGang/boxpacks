import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { useCart } from "@/lib/cart";
import { formatCurrency } from "@/lib/utils";
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, X, MessageSquare, ExternalLink } from "lucide-react";
import { FaTelegram } from "react-icons/fa";

export default function OrderConfirmationModal() {
  const { state, toggleOrderConfirmation, clearCart } = useCart();
  const orderDetailsRef = useRef<HTMLPreElement>(null);
  
  // Format order details for copy/paste
  const getFormattedOrderText = () => {
    if (!state.currentOrder) return "";
    
    const { orderNumber, items, subtotal, shipping, paymentFee, total, shippingMethod, paymentMethod, shippingAddress } = state.currentOrder;
    
    const itemsText = items.map((item, index) => 
      `${index + 1}-${item.name} (${item.weight}) [SKU: ${item.sku}] [${formatCurrency(item.price)}]=${formatCurrency(item.price * item.quantity)}`
    ).join("\n");
    
    const shippingLabel = shippingMethod === "standard" ? "Standard Shipping" : "Overnight Shipping";
    
    // Get payment method display name and fee percentage
    let paymentMethodLabel = "";
    let feePercentage = "";
    
    switch (paymentMethod) {
      case "zelle":
        paymentMethodLabel = "Zelle";
        feePercentage = "5%";
        break;
      case "cashapp":
        paymentMethodLabel = "Cash App";
        feePercentage = "6%";
        break;
      case "chime":
        paymentMethodLabel = "Chime";
        feePercentage = "5%";
        break;
      case "btc":
        paymentMethodLabel = "Bitcoin";
        feePercentage = "2%";
        break;
      case "usdt":
        paymentMethodLabel = "USDT";
        feePercentage = "0%";
        break;
      case "venmo":
        paymentMethodLabel = "Venmo";
        feePercentage = "5%";
        break;
      default:
        paymentMethodLabel = "Payment";
        feePercentage = "5%";
    }
    
    const addressText = `${shippingAddress.firstName} ${shippingAddress.lastName}
${shippingAddress.address1}${shippingAddress.address2 ? `, ${shippingAddress.address2}` : ''}
${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}`;
    
    return `🛒 ORDER REQUEST  
 
ITEMS: 
${itemsText} 
 
ORDER SUMMARY 
------------- 
Total Items: ${items.length} 
Subtotal: ${formatCurrency(subtotal)} 
Shipping (${shippingLabel}): ${formatCurrency(shipping)} 
${paymentMethodLabel} Fee ${feePercentage} = ${formatCurrency(paymentFee)} 
Total due = ${formatCurrency(total)}

${shippingMethod === "overnight" ? "OVERNIGHT SHIPPING ORDER SELECTED ✓" : "STANDARD SHIPPING ORDER SELECTED ✓"}
PAYMENT METHOD: ${paymentMethodLabel.toUpperCase()} ✓
SHIPPING ADDRESS: 
${addressText}

Order Number: #${orderNumber}`;
  };
  
  // When closing the modal, clear the cart
  const handleClose = () => {
    toggleOrderConfirmation(false);
    clearCart();
  };
  
  return (
    <Dialog open={state.orderConfirmationOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold font-montserrat">Order Confirmed</DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="my-6">
          <div className="flex justify-center mb-4">
            <div className="bg-accent text-primary rounded-full w-16 h-16 flex items-center justify-center">
              <CheckCircle className="h-8 w-8" />
            </div>
          </div>
          <p className="text-center mb-4">
            Your order has been placed successfully. Please copy the order details below and send it along with your payment.
          </p>
        </div>
        
        <div className="bg-secondary p-4 rounded mb-4 font-mono text-sm">
          <ScrollArea className="max-h-[200px]">
            <pre ref={orderDetailsRef} className="whitespace-pre-wrap">
              {getFormattedOrderText()}
            </pre>
          </ScrollArea>
        </div>
        
        <div className="flex flex-col space-y-3">
          <CopyToClipboard 
            text={getFormattedOrderText()} 
            className="bg-accent hover:bg-accent/90 text-primary font-bold"
          />
          
          <Button 
            variant="outline" 
            className="bg-[#3a76f0] hover:bg-[#4a86ff] text-white border-[#3a76f0]"
            asChild
          >
            <a 
              href="https://signal.me/#eu/example" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact on Signal
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
          
          <Button 
            variant="outline" 
            className="bg-[#0088cc] hover:bg-[#0099dd] text-white border-[#0088cc]"
            asChild
          >
            <a 
              href="https://t.me/yourusername" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <FaTelegram className="mr-2 h-4 w-4" />
              Contact on Telegram
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
          
          <Button 
            variant="secondary"
            onClick={handleClose}
            asChild
          >
            <Link href="/account">
              <a className="w-full flex items-center justify-center">
                View My Orders
              </a>
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
