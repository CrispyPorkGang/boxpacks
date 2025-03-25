import { useState, useEffect } from "react";
import { useCart, ShippingInfo, ShippingMethod, PaymentMethod } from "@/lib/cart";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addressSchema, paymentMethodSchema } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Extend the address schema with email and telegram handle
const checkoutFormSchema = addressSchema.extend({
  email: z.string().email("Please enter a valid email"),
  telegramHandle: z.string().min(3, "Telegram handle must be at least 3 characters"),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function CheckoutModal() {
  const { state, toggleCheckout, setCurrentOrder, toggleOrderConfirmation, getTotals, setPaymentMethod } = useCart();
  const { user } = useAuth();
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>(state.shippingMethod);
  const [paymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(state.paymentMethod);
  
  const { subtotal, shipping, paymentFee, total } = getTotals();
  
  // Effect to update global shipping and payment method state when local state changes
  useEffect(() => {
    setShippingMethod(shippingMethod);
  }, [shippingMethod, setShippingMethod]);
  
  // Effect to update global payment method state when local state changes
  useEffect(() => {
    setPaymentMethod(paymentMethod);
  }, [paymentMethod, setPaymentMethod]);
  
  // Create form with default values
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
      email: user?.email || "",
      telegramHandle: user?.telegramHandle || "",
    }
  });
  
  // Handle payment method changes
  const handlePaymentMethodChange = (value: string) => {
    const newPaymentMethod = value as PaymentMethod;
    setSelectedPaymentMethod(newPaymentMethod);
    setPaymentMethod(newPaymentMethod);
  };

  // Order creation mutation
  const orderMutation = useMutation({
    mutationFn: async (formData: CheckoutFormValues) => {
      const shippingAddress = { ...formData };
      
      const orderData = {
        userId: user?.id,
        totalAmount: total,
        shippingMethod: shippingMethod === "standard" ? "Standard Shipping" : "Overnight Shipping",
        shippingCost: shipping,
        paymentMethod: paymentMethod,
        paymentFee: paymentFee,
        shippingAddress,
        items: state.items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          sku: item.sku,
          weight: item.weight
        }))
      };
      
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    }
  });
  
  const onSubmit = (formData: CheckoutFormValues) => {
    if (!user) return;
    
    orderMutation.mutate(formData, {
      onSuccess: (data) => {
        // Format order for confirmation page
        const shippingLabel = shippingMethod === "standard" ? "Standard Shipping" : "Overnight Shipping";
        
        const shippingAddress: ShippingInfo = {
          ...formData
        };
        
        setCurrentOrder({
          orderNumber: data.orderNumber,
          items: state.items,
          subtotal,
          shipping,
          paymentFee,
          total,
          shippingMethod,
          paymentMethod,
          shippingAddress
        });
        
        toggleCheckout(false);
        toggleOrderConfirmation(true);
      }
    });
  };
  
  return (
    <Dialog open={state.checkoutOpen} onOpenChange={toggleCheckout}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-4 pt-4">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold font-montserrat">Checkout</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => toggleCheckout(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-medium mb-4">Shipping Information</h3>
                <Form {...form}>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="address1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apartment, suite, etc. (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              >
                                <option value="US">United States</option>
                                <option value="CA">Canada</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!!user?.email} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="telegramHandle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telegram Username</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Shipping Method</h4>
                      <RadioGroup 
                        defaultValue={shippingMethod} 
                        onValueChange={(value) => setShippingMethod(value as ShippingMethod)}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="standard" id="standard" />
                          <label htmlFor="standard" className="cursor-pointer">Standard Shipping ($50.00)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="overnight" id="overnight" />
                          <label htmlFor="overnight" className="cursor-pointer">Overnight Shipping ($100.00)</label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Payment Method</h4>
                      <RadioGroup 
                        defaultValue={paymentMethod} 
                        onValueChange={handlePaymentMethodChange}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="zelle" id="zelle" />
                          <label htmlFor="zelle" className="cursor-pointer">Zelle (5% fee)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cashapp" id="cashapp" />
                          <label htmlFor="cashapp" className="cursor-pointer">Cash App (6% fee)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="chime" id="chime" />
                          <label htmlFor="chime" className="cursor-pointer">Chime (5% fee)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="btc" id="btc" />
                          <label htmlFor="btc" className="cursor-pointer">Bitcoin (2% fee)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="usdt" id="usdt" />
                          <label htmlFor="usdt" className="cursor-pointer">USDT (0% fee)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="venmo" id="venmo" />
                          <label htmlFor="venmo" className="cursor-pointer">Venmo (5% fee)</label>
                        </div>
                      </RadioGroup>
                    </div>
                  </form>
                </Form>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-4">Order Summary</h3>
                <div className="bg-secondary p-4 rounded mb-4">
                  <div className="space-y-2">
                    {state.items.map((item) => (
                      <div key={item.productId} className="flex justify-between mb-2">
                        <div>
                          <span className="font-medium">{item.name} ({item.weight})</span>
                          <span className="text-gray-400 ml-2">x{item.quantity}</span>
                        </div>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>{formatCurrency(shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        {paymentMethod === 'zelle' && 'Zelle Fee (5%):'}
                        {paymentMethod === 'cashapp' && 'Cash App Fee (6%):'}
                        {paymentMethod === 'chime' && 'Chime Fee (5%):'}
                        {paymentMethod === 'btc' && 'Bitcoin Fee (2%):'}
                        {paymentMethod === 'usdt' && 'USDT Fee (0%):'}
                        {paymentMethod === 'venmo' && 'Venmo Fee (5%):'}
                      </span>
                      <span>{formatCurrency(paymentFee)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-white">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-primary font-bold"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={orderMutation.isPending}
                >
                  {orderMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
                
                <p className="text-sm text-gray-400 mt-4">
                  By placing your order, you agree to our <a href="#" className="text-accent hover:underline">Terms of Service</a> and <a href="#" className="text-accent hover:underline">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
