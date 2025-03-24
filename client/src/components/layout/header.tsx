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
    <header className="bg-primary sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-2xl font-bold font-montserrat text-accent">
                ChronicHub
              </a>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <NavLink href="/" label="Home" currentPath={location} />
            <NavLink href="/shop" label="Shop" currentPath={location} />
            {user?.isAdmin && (
              <NavLink href="/admin" label="Admin" currentPath={location} />
            )}
            <NavLink href="/account" label="Account" currentPath={location} />
          </nav>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-foreground hover:text-accent transition">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-medium">
                    {user.username}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">
                      <a className="flex w-full items-center">
                        <Package className="mr-2 h-4 w-4" />
                        My Orders
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  {user.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <a className="flex w-full items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Panel
                        </a>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button variant="ghost" size="icon" className="text-foreground hover:text-accent transition">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-foreground hover:text-accent transition relative"
              onClick={() => toggleCart(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-primary text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-foreground">
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-primary">
                <nav className="flex flex-col space-y-4 mt-8">
                  <MobileNavLink href="/" label="Home" onClick={closeMenu} />
                  <MobileNavLink href="/shop" label="Shop" onClick={closeMenu} />
                  {user?.isAdmin && (
                    <MobileNavLink href="/admin" label="Admin" onClick={closeMenu} />
                  )}
                  <MobileNavLink href="/account" label="Account" onClick={closeMenu} />
                  
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    {user ? (
                      <>
                        <div className="text-sm text-muted-foreground mb-4">
                          Signed in as <span className="font-semibold">{user.username}</span>
                        </div>
                        <Button 
                          variant="secondary" 
                          className="w-full"
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
                        variant="secondary" 
                        className="w-full"
                        onClick={closeMenu}
                        asChild
                      >
                        <Link href="/auth">
                          <a className="flex items-center justify-center">
                            <User className="mr-2 h-4 w-4" />
                            Sign In
                          </a>
                        </Link>
                      </Button>
                    )}
                  </div>
                </nav>
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
    <Link href={href}>
      <a className={`text-${isActive ? 'accent' : 'foreground'} hover:text-accent transition font-medium`}>
        {label}
      </a>
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
    <Link href={href}>
      <a 
        className="text-foreground hover:text-accent transition font-medium py-2 px-4"
        onClick={onClick}
      >
        {label}
      </a>
    </Link>
  );
}
