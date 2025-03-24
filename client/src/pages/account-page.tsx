import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Eye, User, Package, MessageSquare } from "lucide-react";

export default function AccountPage() {
  const { user } = useAuth();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
  });
  
  const { data: selectedOrder, isLoading: orderDetailsLoading } = useQuery({
    queryKey: [`/api/orders/${selectedOrderId}`],
    enabled: !!selectedOrderId,
  });
  
  const { data: chatMessages, isLoading: chatLoading } = useQuery({
    queryKey: ["/api/chat"],
  });
  
  if (!user) {
    return null; // Protected route will handle redirect
  }
  
  // Format order details for copy/paste
  const getFormattedOrderText = (order: any) => {
    if (!order) return "";
    
    const itemsText = order.items.map((item: any, index: number) => 
      `${index + 1}-${item.name} (${item.weight}) [SKU: ${item.sku}] [${formatCurrency(item.price)}]=${formatCurrency(item.price * item.quantity)}`
    ).join("\n");
    
    const address = order.shippingAddress;
    const addressText = `${address.firstName} ${address.lastName}
${address.address1}${address.address2 ? `, ${address.address2}` : ''}
${address.city}, ${address.state} ${address.zipCode}`;
    
    return `🛒 ORDER REQUEST  
 
ITEMS: 
${itemsText} 
 
ORDER SUMMARY 
------------- 
Total Items: ${order.items.length} 
Subtotal: ${formatCurrency(order.totalAmount - order.shippingCost - order.cashAppFee)} 
Shipping (${order.shippingMethod}): ${formatCurrency(order.shippingCost)} 
CASH APP Fee 5% = ${formatCurrency(order.cashAppFee)} 
Total due = ${formatCurrency(order.totalAmount)}

${order.shippingMethod.toUpperCase()} ORDER SELECTED ✓
SHIPPING ADDRESS: 
${addressText}

Order Number: #${order.orderNumber}`;
  };
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'shipped':
        return 'bg-blue-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="py-12 bg-secondary min-h-screen">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="font-medium">{user.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telegram Handle</p>
                    <p className="font-medium">{user.telegramHandle || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Created</p>
                    <p className="font-medium">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <Tabs defaultValue="orders">
              <TabsList className="mb-6">
                <TabsTrigger value="orders" className="flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="messages" className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>
                      View your past orders and their details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {ordersLoading ? (
                      <div className="flex justify-center items-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-accent" />
                      </div>
                    ) : orders && orders.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order #</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order: any) => (
                            <TableRow key={order.id}>
                              <TableCell>{order.orderNumber}</TableCell>
                              <TableCell>{formatDate(order.createdAt)}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(order.totalAmount)}
                              </TableCell>
                              <TableCell className="text-right">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setSelectedOrderId(order.id)}
                                    >
                                      <Eye className="h-4 w-4 mr-1" /> View
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-3xl">
                                    <DialogHeader>
                                      <DialogTitle>Order #{selectedOrder?.orderNumber}</DialogTitle>
                                    </DialogHeader>
                                    {orderDetailsLoading ? (
                                      <div className="flex justify-center items-center p-6">
                                        <Loader2 className="h-6 w-6 animate-spin text-accent" />
                                      </div>
                                    ) : selectedOrder ? (
                                      <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                          <div>
                                            <p className="text-sm text-muted-foreground">Order Date</p>
                                            <p>{formatDate(selectedOrder.createdAt)}</p>
                                          </div>
                                          <Badge className={getStatusColor(selectedOrder.status)}>
                                            {selectedOrder.status}
                                          </Badge>
                                        </div>
                                        
                                        <Separator />
                                        
                                        <div>
                                          <h3 className="font-medium mb-2">Items</h3>
                                          <div className="space-y-2">
                                            {selectedOrder.items.map((item: any) => (
                                              <div key={item.id} className="flex justify-between">
                                                <div>
                                                  <p className="font-medium">{item.name} ({item.weight})</p>
                                                  <p className="text-sm text-muted-foreground">
                                                    SKU: {item.sku} | Qty: {item.quantity}
                                                  </p>
                                                </div>
                                                <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                        
                                        <Separator />
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          <div>
                                            <h3 className="font-medium mb-2">Shipping Address</h3>
                                            <p>{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                                            <p>{selectedOrder.shippingAddress.address1}</p>
                                            {selectedOrder.shippingAddress.address2 && (
                                              <p>{selectedOrder.shippingAddress.address2}</p>
                                            )}
                                            <p>
                                              {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                                            </p>
                                            <p>{selectedOrder.shippingAddress.country}</p>
                                          </div>
                                          
                                          <div>
                                            <h3 className="font-medium mb-2">Order Summary</h3>
                                            <div className="space-y-2">
                                              <div className="flex justify-between">
                                                <p>Subtotal</p>
                                                <p>{formatCurrency(selectedOrder.totalAmount - selectedOrder.shippingCost - selectedOrder.cashAppFee)}</p>
                                              </div>
                                              <div className="flex justify-between">
                                                <p>Shipping ({selectedOrder.shippingMethod})</p>
                                                <p>{formatCurrency(selectedOrder.shippingCost)}</p>
                                              </div>
                                              <div className="flex justify-between">
                                                <p>Cash App Fee (5%)</p>
                                                <p>{formatCurrency(selectedOrder.cashAppFee)}</p>
                                              </div>
                                              <Separator />
                                              <div className="flex justify-between font-medium">
                                                <p>Total</p>
                                                <p className="text-accent">{formatCurrency(selectedOrder.totalAmount)}</p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <Separator />
                                        
                                        <div>
                                          <h3 className="font-medium mb-2">Order Details</h3>
                                          <div className="bg-secondary p-4 rounded-md font-mono text-sm">
                                            <pre className="whitespace-pre-wrap">
                                              {getFormattedOrderText(selectedOrder)}
                                            </pre>
                                          </div>
                                          <div className="mt-4">
                                            <CopyToClipboard
                                              text={getFormattedOrderText(selectedOrder)}
                                              className="w-full"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <p>No order details found</p>
                                    )}
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-12">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                        <p className="text-muted-foreground mb-6">
                          You haven't placed any orders yet. Start shopping to see your orders here.
                        </p>
                        <Button asChild>
                          <a href="/shop">Shop Now</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="messages">
                <Card>
                  <CardHeader>
                    <CardTitle>Message History</CardTitle>
                    <CardDescription>
                      View your chat history with our support team
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {chatLoading ? (
                      <div className="flex justify-center items-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-accent" />
                      </div>
                    ) : chatMessages && chatMessages.length > 0 ? (
                      <div className="space-y-4">
                        {chatMessages.map((message: any) => (
                          <div 
                            key={message.id}
                            className={`flex ${message.fromUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[80%] rounded-lg p-3 ${
                                message.fromUser 
                                  ? 'bg-accent text-primary' 
                                  : 'bg-secondary'
                              }`}
                            >
                              <p className="text-sm">{message.message}</p>
                              <span className="text-xs text-gray-400 mt-1 block">
                                {message.fromUser ? 'You' : 'Support Team'} • {formatDate(message.createdAt)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                        <p className="text-muted-foreground mb-6">
                          You haven't sent any messages yet. Use the chat bubble to contact our support team.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
