import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CategoryForm from "@/components/admin/category-form";
import { Link } from "wouter";

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
import { 
  Loader2, 
  Home, 
  PlusCircle, 
  Pencil, 
  Trash, 
  AlertTriangle,
  Tag,
  Hash
} from "lucide-react";

export default function AdminCategories() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get all categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ["/api/categories"],
  });
  
  // Get product counts per category
  const { data: products } = useQuery({
    queryKey: ["/api/products"],
  });
  
  // Count products per category
  const getProductCountByCategory = (categoryId: number) => {
    if (!products) return 0;
    return products.filter((product: any) => product.categoryId === categoryId).length;
  };
  
  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/categories/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Category deleted",
        description: "The category has been deleted successfully",
      });
      
      // Refetch categories
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      
      // Close delete dialog
      setDeleteCategoryId(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to delete category",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleDelete = (categoryId: number) => {
    deleteMutation.mutate(categoryId);
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage your product categories</p>
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
            Add Category
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
          <CardDescription>
            Create and manage categories for your products
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
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories && categories.length > 0 ? (
                    categories.map((category: any) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.id}</TableCell>
                        <TableCell className="font-medium flex items-center">
                          <Tag className="h-4 w-4 mr-2 text-accent" />
                          {category.name}
                        </TableCell>
                        <TableCell className="font-mono text-sm flex items-center">
                          <Hash className="h-3 w-3 mr-1 text-muted-foreground" />
                          {category.slug}
                        </TableCell>
                        <TableCell>
                          <span className="inline-block bg-secondary text-foreground px-2 py-1 text-xs rounded-full">
                            {getProductCountByCategory(category.id)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(category.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => setEditingCategoryId(category.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="icon"
                              onClick={() => setDeleteCategoryId(category.id)}
                              disabled={getProductCountByCategory(category.id) > 0}
                              title={getProductCountByCategory(category.id) > 0 ? 
                                "Cannot delete categories with products" : 
                                "Delete category"}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-muted-foreground mb-2">No categories found</p>
                          <Button onClick={() => setIsAddOpen(true)}>
                            Add your first category
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
      
      {/* Add Category Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category for your products
            </DialogDescription>
          </DialogHeader>
          <CategoryForm onSuccess={() => setIsAddOpen(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Edit Category Dialog */}
      <Dialog 
        open={editingCategoryId !== null} 
        onOpenChange={(open) => !open && setEditingCategoryId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update your category details
            </DialogDescription>
          </DialogHeader>
          {editingCategoryId && (
            <CategoryForm 
              categoryId={editingCategoryId} 
              onSuccess={() => setEditingCategoryId(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteCategoryId !== null} 
        onOpenChange={(open) => !open && setDeleteCategoryId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-destructive">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setDeleteCategoryId(null)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteCategoryId && handleDelete(deleteCategoryId)}
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
