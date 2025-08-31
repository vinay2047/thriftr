import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, User, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/useCartStore";
import ModeToggle from "@/components/ModeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { authUser, logout } = useAuthStore();
  const { cartItems, fetchCartItems } = useCartStore();
  

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    if (authUser) fetchCartItems();
  }, [authUser, fetchCartItems]);

  return (
    <nav className="fixed top-0 left-0 w-full bg-card text-card-foreground shadow-md z-50">
      <div className="max-w-screen-xl mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-lg font-semibold">
          thriftr
        </Link>

        {/* Center - All Products (always visible) */}
        <Link
          to="/products"
          className="text-sm font-medium hover:text-primary transition-colors absolute left-1/2 -translate-x-1/2"
        >
          All Products
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            {!authUser ? (
              <>
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="xs"
                    className="text-black border-black hover:bg-black hover:text-white dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black transition-colors"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    size="xs"
                    className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {/* Cart Button */}
                <Link to="/cart" className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {cartItems.length}
                      </span>
                    )}
                  </Button>
                </Link>

                {/* Profile Button */}
                <Link to="/profile">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </Link>

                {/* Logout Button */}
                <Button
                  onClick={handleLogout}
                  size="sm"
                  variant="default"
                  className="text-white transition-colors"
                >
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* ModeToggle should always be visible */}
          <ModeToggle />

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed top-0 right-0 w-64 h-full bg-card shadow-lg z-50 p-6 space-y-4 md:hidden">
          <button
            className="absolute top-4 right-4"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>

          {!authUser ? (
            <div className="flex flex-col gap-4 mt-10">
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-black border-black hover:bg-black hover:text-white dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black transition-colors"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  size="sm"
                  className="w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4 mt-10">
              {/* Cart */}
              <Link to="/cart" onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Cart ({cartItems.length})
                </Button>
              </Link>

              {/* Your Orders */}
              <Link to="/orders" onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start flex items-center gap-2"
                >
                  <ClipboardList className="h-4 w-4" />
                  Your Orders
                </Button>
              </Link>

              {/* Profile */}
              <Link to="/profile" onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </Link>

              {/* Logout */}
              <Button
                onClick={() => {
                  handleLogout();
          
                  setIsOpen(false);
                }}
                size={"xs"}
                className="w-full text-white"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
