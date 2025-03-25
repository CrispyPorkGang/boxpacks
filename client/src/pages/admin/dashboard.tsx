import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { formatCurrency } from "@/lib/utils";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, DollarSign, Tag, BadgePercent } from "lucide-react";

export default function AdminDashboard() {
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
  });
  
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
  });
  
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
  });
  
  const { data: sales, isLoading: salesLoading } = useQuery({
    queryKey: ["/api/sales/active"],
  });
  
  const isLoading = ordersLoading || productsLoading || categoriesLoading || salesLoading;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-gray-500 text-white';
    
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
  
  // Calculate total revenue from orders
  const totalRevenue = orders
    ? orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0)
    : 0;
  
  // Get counts
  const totalOrders = orders?.length || 0;
  const totalProducts = products?.length || 0;
  const totalCategories = categories?.length || 0;
  const totalActiveSales = sales?.length || 0;
  
  // Get recent orders
  const recentOrders = orders 
    ? [...orders].sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 5)
    : [];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your products, categories, and monitor orders</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalOrders}</div>
                <p className="text-xs text-muted-foreground mt-1">Total orders placed</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(totalRevenue)}</div>
                <p className="text-xs text-muted-foreground mt-1">Total revenue</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Tag className="mr-2 h-4 w-4" />
                  Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalProducts}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across {totalCategories} categories
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BadgePercent className="mr-2 h-4 w-4" />
                  Active Sales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalActiveSales}</div>
                <p className="text-xs text-muted-foreground mt-1">Current promotions</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Showing the {recentOrders.length} most recent orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentOrders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order: any) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.orderNumber}</TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(order.totalAmount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">No orders yet</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
                <CardDescription>
                  Manage your store with these quick actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center" asChild>
                    <Link href="/admin/products">
                      <Tag className="h-6 w-6 mb-2" />
                      <span>Manage Products</span>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center" asChild>
                    <Link href="/admin/categories">
                      <Package className="h-6 w-6 mb-2" />
                      <span>Manage Categories</span>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center" asChild>
                    <Link href="/admin/sales">
                      <BadgePercent className="h-6 w-6 mb-2" />
                      <span>Manage Sales</span>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center" asChild>
                    <Link href="/shop">
                      <DollarSign className="h-6 w-6 mb-2" />
                      <span>View Store</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Active Sales</h2>
            <Button variant="outline" asChild>
              <Link href="/admin/sales">View All</Link>
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Original Price</TableHead>
                    <TableHead>Sale Price</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales && sales.length > 0 ? (
                    sales.map((sale: any) => (
                      <TableRow key={sale.id}>
                        <TableCell>{sale.product?.name || "Unknown"}</TableCell>
                        <TableCell>{sale.discountPercentage}%</TableCell>
                        <TableCell>{formatCurrency(sale.product?.price || 0)}</TableCell>
                        <TableCell className="font-medium text-accent">
                          {formatCurrency((sale.product?.price || 0) * (1 - sale.discountPercentage / 100))}
                        </TableCell>
                        <TableCell>{formatDate(sale.startDate)}</TableCell>
                        <TableCell>{sale.endDate ? formatDate(sale.endDate) : "No end date"}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500 text-white">
                            Active
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No active sales at the moment
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
