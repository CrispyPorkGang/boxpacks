import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCategorySchema } from "@shared/schema";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Create slugified version of name
const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

type CategoryFormValues = z.infer<typeof insertCategorySchema>;

interface CategoryFormProps {
  categoryId?: number;
  onSuccess?: () => void;
}

export default function CategoryForm({ categoryId, onSuccess }: CategoryFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const isEditing = !!categoryId;
  
  // Fetch category data if editing
  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: [`/api/categories/${categoryId}`],
    enabled: isEditing,
  });
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });
  
  // Set form defaults when category data is loaded
  React.useEffect(() => {
    if (category && isEditing) {
      form.reset(category);
    }
  }, [category, isEditing, form]);
  
  // Auto-generate slug when name changes
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "name") {
        form.setValue("slug", createSlug(value.name || ""));
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);
  
  // Handle creating or updating a category
  const mutation = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      if (isEditing) {
        const res = await apiRequest("PUT", `/api/categories/${categoryId}`, data);
        return res.json();
      } else {
        const res = await apiRequest("POST", "/api/categories", data);
        return res.json();
      }
    },
    onSuccess: () => {
      toast({
        title: `Category ${isEditing ? "updated" : "created"} successfully`,
        description: `The category has been ${isEditing ? "updated" : "created"}.`,
      });
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      if (isEditing) {
        queryClient.invalidateQueries({ queryKey: [`/api/categories/${categoryId}`] });
      }
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form if creating new category
      if (!isEditing) {
        form.reset({
          name: "",
          slug: "",
        });
      }
    },
    onError: (error) => {
      toast({
        title: `Failed to ${isEditing ? "update" : "create"} category`,
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: CategoryFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Category" : "Add New Category"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="category-slug" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline"
              onClick={onSuccess}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={mutation.isPending || categoryLoading}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                isEditing ? "Update Category" : "Create Category"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
