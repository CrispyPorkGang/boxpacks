import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import ShopPage from "@/pages/shop-page";
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
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import CartDrawer from "./components/cart/cart-drawer";
import CheckoutModal from "./components/cart/checkout-modal";
import OrderConfirmationModal from "./components/cart/order-confirmation-modal";
import ChatBubble from "./components/chat/chat-bubble";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/shop" component={ShopPage} />
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
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TelegramProvider>
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
            <Toaster />
          </TelegramProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
