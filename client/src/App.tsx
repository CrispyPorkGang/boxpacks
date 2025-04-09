import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import ShopPage from "@/pages/shop-page";
import ProductDetailPage from "@/pages/product-detail-page";
import AuthPage from "@/pages/auth-page";
import AccountPage from "@/pages/account-page";
import ContactPage from "@/pages/contact-page";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProducts from "@/pages/admin/products";
import AdminCategories from "@/pages/admin/categories";
import AdminSales from "@/pages/admin/sales";

import { ProtectedRoute, AdminRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import { CartProvider } from "./lib/cart";
import { TelegramProvider } from "./hooks/use-telegram";
import { ThemeProvider } from "./hooks/use-theme";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import CartDrawer from "./components/cart/cart-drawer";
import CheckoutModal from "./components/cart/checkout-modal";
import OrderConfirmationModal from "./components/cart/order-confirmation-modal";
import ChatBubble from "./components/chat/chat-bubble";
import PasswordGate from "./components/password-gate";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/shop" component={ShopPage} />
      <Route path="/product/:id" component={ProductDetailPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/account" component={AccountPage} />
      <AdminRoute path="/admin" component={AdminDashboard} />
      <AdminRoute path="/admin/products" component={AdminProducts} />
      <AdminRoute path="/admin/categories" component={AdminCategories} />
      <AdminRoute path="/admin/sales" component={AdminSales} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Define the site password
  const SITE_PASSWORD = "boxpacks"; // You can change this to any password you want
  
  // State to track if the site is unlocked
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isCheckingStorage, setIsCheckingStorage] = useState(true);

  // Check localStorage on initial load
  useEffect(() => {
    const unlocked = localStorage.getItem("site_unlocked");
    if (unlocked === "true") {
      setIsUnlocked(true);
    }
    setIsCheckingStorage(false);
  }, []);

  // Handle successful password entry
  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  // Show loading state while checking localStorage
  if (isCheckingStorage) {
    return (
      <div className="fixed inset-0 w-full h-full bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <TelegramProvider>
              {!isUnlocked ? (
                <PasswordGate correctPassword={SITE_PASSWORD} onUnlock={handleUnlock} />
              ) : (
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-1">
                    <Router />
                  </main>
                  <Footer />
                  <CartDrawer />
                  <CheckoutModal />
                  <OrderConfirmationModal />
                  <ChatBubble />
                </div>
              )}
              <Toaster />
            </TelegramProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
