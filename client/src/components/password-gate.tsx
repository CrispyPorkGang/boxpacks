import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const passwordSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

interface PasswordGateProps {
  correctPassword: string;
  onUnlock: () => void;
}

export default function PasswordGate({ correctPassword, onUnlock }: PasswordGateProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof passwordSchema>) {
    setIsLoading(true);
    
    // Simulating server check with a small delay
    setTimeout(() => {
      if (data.password === correctPassword) {
        onUnlock();
        localStorage.setItem("site_unlocked", "true");
      } else {
        toast({
          variant: "destructive",
          title: "Incorrect Password",
          description: "The password you entered is incorrect. Please try again.",
        });
        form.reset();
      }
      setIsLoading(false);
    }, 500);
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-black flex flex-col items-center justify-center z-50">
      <div className="max-w-md w-full px-4">
        <div className="mb-8 text-center">
          <img src="/boxpacks.png" alt="BoxPacksLA" className="h-20 mx-auto mb-8" />
          <h1 className="text-2xl md:text-3xl font-bold mb-3 text-gold">Password Protected</h1>
          <p className="text-zinc-400">
            This website is private. Please enter the password to continue.
          </p>
        </div>

        <div className="bg-black/30 border border-zinc-800 rounded-lg p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        {...field}
                        className="bg-black/50 border-zinc-700 text-zinc-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full button-gold border-2 border-gold/30 shadow-md h-11"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Enter Site'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}