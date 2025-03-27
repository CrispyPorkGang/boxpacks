import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Menu, 
  X, 
  ShoppingCart, 
  User, 
  LogOut,
  Package,
  Settings,
  CreditCard
} from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { state, toggleCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Calculate total items in cart
  const cartItemCount = state.items.reduce((count, item) => count + item.quantity, 0);
  
  return (
    <header className="bg-black sticky top-0 z-50 border-b border-zinc-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src="/BoxPacksLA_Logo-01.png" alt="BoxPacksLA" className="h-12" />
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink href="/" label="Home" currentPath={location} />
            <NavLink href="/shop" label="Shop" currentPath={location} />
            <NavLink href="/contact" label="Contact" currentPath={location} />
            {user?.isAdmin && (
              <NavLink href="/admin" label="Admin" currentPath={location} />
            )}
            <Link href="/account" className="nav-link flex items-center">
              <User className="h-5 w-5 mr-1.5" />
              {user ? user.username : "Account"}
            </Link>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-zinc-100 hover:text-primary transition relative"
              onClick={() => toggleCart(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </nav>
          
          <div className="flex md:hidden items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-zinc-100 hover:text-primary transition relative"
              onClick={() => toggleCart(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-zinc-100">
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-zinc-900 border-l border-zinc-800">
                <div className="flex flex-col space-y-8 pt-8">
                  <nav className="flex flex-col space-y-6">
                    <MobileNavLink href="/" label="Home" onClick={closeMenu} />
                    <MobileNavLink href="/shop" label="Shop" onClick={closeMenu} />
                    <MobileNavLink href="/contact" label="Contact" onClick={closeMenu} />
                    <MobileNavLink href="/account" label="Account" onClick={closeMenu} />
                    {user?.isAdmin && (
                      <MobileNavLink href="/admin" label="Admin" onClick={closeMenu} />
                    )}
                  </nav>
                  
                  <div className="border-t border-zinc-800 pt-6">
                    {user ? (
                      <>
                        <div className="text-sm text-zinc-400 mb-4">
                          Signed in as <span className="font-semibold text-zinc-300">{user.username}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full border-zinc-700 hover:border-primary text-zinc-200 hover:text-primary"
                          onClick={() => {
                            handleLogout();
                            closeMenu();
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <Button 
                        className="w-full button-gold"
                        onClick={closeMenu}
                        asChild
                      >
                        <Link 
                          href="/auth" 
                          className="flex items-center justify-center"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Sign In
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

// Desktop navigation link
interface NavLinkProps {
  href: string;
  label: string;
  currentPath: string;
}

function NavLink({ href, label, currentPath }: NavLinkProps) {
  const isActive = (
    (href === "/" && currentPath === "/") || 
    (href !== "/" && currentPath.startsWith(href))
  );

  return (
    <Link 
      href={href} 
      className={`${isActive ? 'text-gold' : 'text-zinc-100'} hover:text-gold transition font-medium`}
    >
      {label}
    </Link>
  );
}

// Mobile navigation link
interface MobileNavLinkProps {
  href: string;
  label: string;
  onClick: () => void;
}

function MobileNavLink({ href, label, onClick }: MobileNavLinkProps) {
  return (
    <Link 
      href={href}
      className="text-zinc-100 hover:text-gold transition font-medium py-2 px-4"
      onClick={onClick}
    >
      {label}
    </Link>
  );
}
