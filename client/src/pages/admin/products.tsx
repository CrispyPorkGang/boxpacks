import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ProductForm from "@/components/admin/product-form";
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Home, PlusCircle, Pencil, Trash, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminProducts() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get all products
  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products"],
  });
  
  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully",
      });
      
      // Refetch products
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      
      // Close delete dialog
      setDeleteProductId(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to delete product",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleDelete = (productId: number) => {
    deleteMutation.mutate(productId);
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your products inventory</p>
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
            Add Product
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>
            View and manage all your products
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
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Inventory</TableHead>
                    <TableHead>Sale</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products && products.length > 0 ? (
                    products.map((product: any) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell>
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name} 
                              className="w-10 h-10 object-cover rounded"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">No image</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>
                          {product.sale ? (
                            <div>
                              <span className="text-accent font-medium">
                                {formatCurrency(product.sale.salePrice)}
                              </span>
                              <span className="text-muted-foreground line-through text-xs ml-1">
                                {formatCurrency(product.price)}
                              </span>
                            </div>
                          ) : (
                            formatCurrency(product.price)
                          )}
                        </TableCell>
                        <TableCell>
                          {product.categoryId ? (
                            <span className="inline-block bg-secondary text-foreground px-2 py-1 text-xs rounded-full">
                              {product.categoryName || product.categoryId}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs">No category</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {product.inventory > 0 ? (
                            <span className="text-green-500">{product.inventory}</span>
                          ) : (
                            <span className="text-red-500">Out of stock</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {product.sale ? (
                            <Badge className="bg-red-500 text-white">
                              {product.sale.discountPercentage}% OFF
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">No sale</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => setEditingProductId(product.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="icon"
                              onClick={() => setDeleteProductId(product.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center h-24">
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-muted-foreground mb-2">No products found</p>
                          <Button onClick={() => setIsAddOpen(true)}>
                            Add your first product
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
      
      {/* Add Product Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new product to your inventory
            </DialogDescription>
          </DialogHeader>
          <ProductForm onSuccess={() => setIsAddOpen(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Edit Product Dialog */}
      <Dialog 
        open={editingProductId !== null} 
        onOpenChange={(open) => !open && setEditingProductId(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the details of your product
            </DialogDescription>
          </DialogHeader>
          {editingProductId && (
            <ProductForm 
              productId={editingProductId} 
              onSuccess={() => setEditingProductId(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteProductId !== null} 
        onOpenChange={(open) => !open && setDeleteProductId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-destructive">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setDeleteProductId(null)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteProductId && handleDelete(deleteProductId)}
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
