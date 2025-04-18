import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema } from "@shared/schema";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, X } from "lucide-react";

// Extend the product schema for validation
const productFormSchema = insertProductSchema.extend({
  // These are only used internally for form handling
  imageFile: z.any().optional(),
  videoFile: z.any().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  productId?: number;
  onSuccess?: () => void;
}

export default function ProductForm({ productId, onSuccess }: ProductFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  
  const isEditing = !!productId;
  
  // Fetch categories for the dropdown
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
  });
  
  // Fetch product data if editing
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: [`/api/products/${productId}`],
    enabled: isEditing,
  });
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      images: [],
      videos: [],
      categoryId: undefined,
      sku: "",
      inventory: 0,
      weight: "1 lb",
      imageFile: undefined,
      videoFile: undefined,
    },
  });
  
  // Set form defaults when product data is loaded
  React.useEffect(() => {
    if (product && isEditing) {
      form.reset({
        ...product,
        newImage: "",
        newVideo: "",
      });
    }
  }, [product, isEditing, form]);
  
  // Handle creating or updating a product
  const mutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      // Remove the extra fields we added for form handling
      const { newImage, newVideo, ...productData } = data;
      
      if (isEditing) {
        const res = await apiRequest("PUT", `/api/products/${productId}`, productData);
        return res.json();
      } else {
        const res = await apiRequest("POST", "/api/products", productData);
        return res.json();
      }
    },
    onSuccess: () => {
      toast({
        title: `Product ${isEditing ? "updated" : "created"} successfully`,
        description: `The product has been ${isEditing ? "updated" : "created"}.`,
      });
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      if (isEditing) {
        queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}`] });
      }
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form if creating new product
      if (!isEditing) {
        form.reset({
          name: "",
          description: "",
          price: 0,
          images: [],
          videos: [],
          categoryId: undefined,
          sku: "",
          inventory: 0,
          weight: "1 lb",
          newImage: "",
          newVideo: "",
        });
      }
    },
    onError: (error) => {
      toast({
        title: `Failed to ${isEditing ? "update" : "create"} product`,
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: ProductFormValues) => {
    mutation.mutate(data);
  };
  
  const addImage = () => {
    if (!newImage) return;
    
    const currentImages = form.getValues("images") || [];
    form.setValue("images", [...currentImages, newImage]);
    setNewImage("");
  };
  
  const removeImage = (index: number) => {
    const currentImages = form.getValues("images") || [];
    form.setValue("images", currentImages.filter((_, i) => i !== index));
  };
  
  const addVideo = () => {
    if (!newVideo) return;
    
    const currentVideos = form.getValues("videos") || [];
    form.setValue("videos", [...currentVideos, newVideo]);
    setNewVideo("");
  };
  
  const removeVideo = (index: number) => {
    const currentVideos = form.getValues("videos") || [];
    form.setValue("videos", currentVideos.filter((_, i) => i !== index));
  };
  
  const isLoading = categoriesLoading || (isEditing && productLoading);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Product description" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        placeholder="0.00" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category: any) => (
                          <SelectItem 
                            key={category.id} 
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="SKU123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="inventory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inventory</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input placeholder="1 lb" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <FormLabel>Images</FormLabel>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.watch("images")?.map((image, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={image} 
                        alt={`Product ${index + 1}`} 
                        className="w-20 h-20 object-cover rounded border border-border" 
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter image URL"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                  />
                  <Button type="button" onClick={addImage} variant="outline">
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <FormLabel>Videos</FormLabel>
              <div className="space-y-2">
                <div className="flex flex-col gap-2 mb-2">
                  {form.watch("videos")?.map((video, index) => (
                    <div key={index} className="flex justify-between items-center bg-muted p-2 rounded">
                      <a href={video} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                        {video}
                      </a>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeVideo(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter video URL"
                    value={newVideo}
                    onChange={(e) => setNewVideo(e.target.value)}
                  />
                  <Button type="button" onClick={addVideo} variant="outline">
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </div>
            </div>
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
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                isEditing ? "Update Product" : "Create Product"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
