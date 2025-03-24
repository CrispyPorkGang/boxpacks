import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSaleSchema } from "@shared/schema";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// Extend sale schema with formatted date inputs
const saleFormSchema = insertSaleSchema.omit({ 
  startDate: true, 
  endDate: true 
}).extend({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type SaleFormValues = z.infer<typeof saleFormSchema>;

interface SaleFormProps {
  saleId?: number;
  onSuccess?: () => void;
}

export default function SaleForm({ saleId, onSuccess }: SaleFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const isEditing = !!saleId;
  
  // Fetch products for the dropdown
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
  });
  
  // Fetch sale data if editing
  const { data: sale, isLoading: saleLoading } = useQuery({
    queryKey: [`/api/sales/${saleId}`],
    enabled: isEditing,
  });
  
  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      productId: undefined,
      discountPercentage: 0,
      active: true,
      startDate: new Date().toISOString().split('T')[0],
      endDate: undefined,
    },
  });
  
  // Set form defaults when sale data is loaded
  React.useEffect(() => {
    if (sale && isEditing) {
      form.reset({
        ...sale,
        startDate: sale.startDate ? new Date(sale.startDate).toISOString().split('T')[0] : undefined,
        endDate: sale.endDate ? new Date(sale.endDate).toISOString().split('T')[0] : undefined,
      });
    }
  }, [sale, isEditing, form]);
  
  // Handle creating or updating a sale
  const mutation = useMutation({
    mutationFn: async (data: SaleFormValues) => {
      // Convert string dates back to Date objects
      const payload = {
        ...data,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : new Date().toISOString(),
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
      };
      
      if (isEditing) {
        const res = await apiRequest("PUT", `/api/sales/${saleId}`, payload);
        return res.json();
      } else {
        const res = await apiRequest("POST", "/api/sales", payload);
        return res.json();
      }
    },
    onSuccess: () => {
      toast({
        title: `Sale ${isEditing ? "updated" : "created"} successfully`,
        description: `The sale has been ${isEditing ? "updated" : "created"}.`,
      });
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sales/active"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      
      if (isEditing) {
        queryClient.invalidateQueries({ queryKey: [`/api/sales/${saleId}`] });
      }
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form if creating new sale
      if (!isEditing) {
        form.reset({
          productId: undefined,
          discountPercentage: 0,
          active: true,
          startDate: new Date().toISOString().split('T')[0],
          endDate: undefined,
        });
      }
    },
    onError: (error) => {
      toast({
        title: `Failed to ${isEditing ? "update" : "create"} sale`,
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: SaleFormValues) => {
    mutation.mutate(data);
  };
  
  const isLoading = productsLoading || (isEditing && saleLoading);
  
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
        <CardTitle>{isEditing ? "Edit Sale" : "Add New Sale"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products?.map((product: any) => (
                        <SelectItem 
                          key={product.id} 
                          value={product.id.toString()}
                        >
                          {product.name} - ${product.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="discountPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Percentage (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      max="99" 
                      placeholder="10" 
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
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable this sale
                    </p>
                  </div>
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                isEditing ? "Update Sale" : "Create Sale"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
