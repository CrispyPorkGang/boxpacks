import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import SalesForm from "@/components/admin/sales-form";
import { Link } from "wouter";
import { formatCurrency } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Home, 
  PlusCircle, 
  Pencil, 
  Trash, 
  AlertTriangle,
  Tag,
  Calendar 
} from "lucide-react";

export default function AdminSales() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSaleId, setEditingSaleId] = useState<number | null>(null);
  const [deleteSaleId, setDeleteSaleId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get all sales
  const { data: sales, isLoading } = useQuery({
    queryKey: ["/api/sales"],
  });
  
  // Delete sale mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/sales/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Sale deleted",
        description: "The sale has been deleted successfully",
      });
      
      // Refetch sales and products
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      
      // Close delete dialog
      setDeleteSaleId(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to delete sale",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update sale status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, active }: { id: number; active: boolean }) => {
      return await apiRequest("PUT", `/api/sales/${id}`, { active });
    },
    onSuccess: () => {
      toast({
        title: "Sale status updated",
        description: "The sale status has been updated successfully",
      });
      
      // Refetch sales and products
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update sale status",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleDelete = (saleId: number) => {
    deleteMutation.mutate(saleId);
  };
  
  const handleToggleStatus = (saleId: number, currentStatus: boolean) => {
    toggleStatusMutation.mutate({ id: saleId, active: !currentStatus });
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const isSaleActive = (sale: any) => {
    if (!sale.active) return false;
    
    const now = new Date();
    const startDate = new Date(sale.startDate);
    const endDate = sale.endDate ? new Date(sale.endDate) : null;
    
    return startDate <= now && (!endDate || endDate >= now);
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Sales & Discounts</h1>
          <p className="text-muted-foreground">Manage your promotional sales and discounts</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/admin">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          
          <Button onClick={() => setIsAddOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Sale
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Sales Management</CardTitle>
          <CardDescription>
            Create and manage promotional discounts for your products
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales && sales.length > 0 ? (
                    sales.map((sale: any) => (
                      <TableRow key={sale.id} className={!sale.active ? "opacity-60" : ""}>
                        <TableCell>{sale.id}</TableCell>
                        <TableCell className="font-medium flex items-center">
                          <Tag className="h-4 w-4 mr-2 text-accent" />
                          {sale.product ? sale.product.name : "Unknown Product"}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-red-500 text-white">
                            {sale.discountPercentage}% OFF
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <span className="text-accent font-medium">
                              {sale.product ? formatCurrency(sale.product.price * (1 - sale.discountPercentage / 100)) : "-"}
                            </span>
                            <span className="text-muted-foreground line-through text-xs ml-1">
                              {sale.product ? formatCurrency(sale.product.price) : "-"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-xs">Start: {formatDate(sale.startDate)}</span>
                            </div>
                            {sale.endDate && (
                              <div className="flex items-center mt-1">
                                <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span className="text-xs">End: {formatDate(sale.endDate)}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {sale.active ? (
                            isSaleActive(sale) ? (
                              <Badge className="bg-green-500 text-white">Active</Badge>
                            ) : (
                              <Badge className="bg-yellow-500 text-white">
                                {new Date(sale.startDate) > new Date() ? "Scheduled" : "Ended"}
                              </Badge>
                            )
                          ) : (
                            <Badge className="bg-gray-500 text-white">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant={sale.active ? "destructive" : "outline"}
                              size="sm"
                              onClick={() => handleToggleStatus(sale.id, sale.active)}
                              disabled={toggleStatusMutation.isPending}
                            >
                              {toggleStatusMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                sale.active ? "Deactivate" : "Activate"
                              )}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => setEditingSaleId(sale.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="icon"
                              onClick={() => setDeleteSaleId(sale.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-24">
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-muted-foreground mb-2">No sales found</p>
                          <Button onClick={() => setIsAddOpen(true)}>
                            Create your first sale
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Sale Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Sale</DialogTitle>
            <DialogDescription>
              Create a new promotional discount for a product
            </DialogDescription>
          </DialogHeader>
          <SalesForm onSuccess={() => setIsAddOpen(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Edit Sale Dialog */}
      <Dialog 
        open={editingSaleId !== null} 
        onOpenChange={(open) => !open && setEditingSaleId(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Sale</DialogTitle>
            <DialogDescription>
              Update your promotional discount details
            </DialogDescription>
          </DialogHeader>
          {editingSaleId && (
            <SalesForm 
              saleId={editingSaleId} 
              onSuccess={() => setEditingSaleId(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteSaleId !== null} 
        onOpenChange={(open) => !open && setDeleteSaleId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-destructive">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this sale? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setDeleteSaleId(null)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteSaleId && handleDelete(deleteSaleId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
