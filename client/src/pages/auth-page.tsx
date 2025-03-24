import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { FaTelegram } from "react-icons/fa";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  telegramHandle: z.string().min(3, { message: "Telegram handle must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [location, navigate] = useLocation();
  const { user, loginMutation, registerMutation, isLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      telegramHandle: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onRegisterSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row shadow-lg rounded-lg overflow-hidden border border-zinc-800">
        {/* Left side - Authentication Form */}
        <div className="w-full lg:w-1/2 bg-zinc-900/60 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="text-zinc-100">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-black/60">
              <TabsTrigger value="login" className="data-[state=active]:bg-gold data-[state=active]:text-black">Login</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-gold data-[state=active]:text-black">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="border-none shadow-none bg-transparent text-zinc-100">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Welcome <span className="text-gold">back</span></CardTitle>
                  <CardDescription className="text-zinc-400">
                    Enter your credentials to sign in to your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="example@email.com" {...field} className="bg-black/40 border-zinc-700 focus:border-gold" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="******" {...field} className="bg-black/40 border-zinc-700 focus:border-gold" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full mt-6 button-gold" 
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2 w-full">
                    <Separator className="flex-grow bg-zinc-700" />
                    <span className="text-zinc-500 text-sm">or</span>
                    <Separator className="flex-grow bg-zinc-700" />
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full border-zinc-700 hover:border-gold text-zinc-300 hover:text-gold"
                    onClick={() => setActiveTab("register")}
                  >
                    Create an Account
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card className="border-none shadow-none bg-transparent text-zinc-100">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Create an <span className="text-gold">account</span></CardTitle>
                  <CardDescription className="text-zinc-400">
                    Fill in your details to register a new account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="johndoe" {...field} className="bg-black/40 border-zinc-700 focus:border-gold" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="example@email.com" {...field} className="bg-black/40 border-zinc-700 focus:border-gold" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="telegramHandle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telegram Handle</FormLabel>
                            <FormControl>
                              <div className="flex">
                                <div className="bg-black/60 flex items-center justify-center px-3 border border-r-0 border-zinc-700 rounded-l-md">
                                  <FaTelegram className="text-[#0088cc]" />
                                </div>
                                <Input 
                                  placeholder="yourusername" 
                                  {...field} 
                                  className="rounded-l-none bg-black/40 border-zinc-700 focus:border-gold"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="******" {...field} className="bg-black/40 border-zinc-700 focus:border-gold" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="******" {...field} className="bg-black/40 border-zinc-700 focus:border-gold" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full mt-6 button-gold" 
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2 w-full">
                    <Separator className="flex-grow bg-zinc-700" />
                    <span className="text-zinc-500 text-sm">or</span>
                    <Separator className="flex-grow bg-zinc-700" />
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full border-zinc-700 hover:border-gold text-zinc-300 hover:text-gold"
                    onClick={() => setActiveTab("login")}
                  >
                    Sign In
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right side - Hero */}
        <div className="w-full lg:w-1/2 bg-black p-12 hidden lg:flex flex-col justify-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-2 gold-gradient">BoxPacks</h1>
            <h2 className="text-2xl font-bold mb-6">Premium Quality <span className="text-gold">Products</span></h2>
            <p className="text-zinc-300 mb-6">
              Join our community to access exclusive premium products with fast and discreet shipping options. Create an account to place orders and track your purchase history.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-gold text-black rounded-full h-6 w-6 flex items-center justify-center mt-0.5 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-zinc-200">Premium quality products</span>
              </div>
              <div className="flex items-start">
                <div className="bg-gold text-black rounded-full h-6 w-6 flex items-center justify-center mt-0.5 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-zinc-200">Overnight shipping available</span>
              </div>
              <div className="flex items-start">
                <div className="bg-gold text-black rounded-full h-6 w-6 flex items-center justify-center mt-0.5 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-zinc-200">Access to exclusive sales and deals</span>
              </div>
              <div className="flex items-start">
                <div className="bg-gold text-black rounded-full h-6 w-6 flex items-center justify-center mt-0.5 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-zinc-200">Direct chat support via Telegram</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
