import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import ModeToggle from "@/components/ModeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { authUser, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-card text-card-foreground shadow-md z-50">
      <div className="max-w-screen-xl mx-auto px-4 py-2 flex justify-between items-center">
        <Link to="/" className="text-lg font-semibold">
          thriftr
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-1"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Desktop / Mobile Menu */}
        <div className={`lg:flex lg:items-center ${isOpen ? "block" : "hidden"} space-x-3`}>
          {!authUser ? (
            <div className=" flex items-center gap-x-4">
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
            </div>
          ) : (
            <Button
              onClick={handleLogout}
              size="sm"
              className="bg-purple-500 text-white hover:bg-purple-600 transition-colors"
            >
              Logout
            </Button>
          )}
          {/* Add gap between auth buttons and ModeToggle */}
          <div className="ml-2">
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
