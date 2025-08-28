import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Eye, EyeOff, Lock } from "lucide-react";
import AuthImagePattern from "@/components/AuthImagePattern";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const { login, isLoading, authUser } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   login(formData as any);
    
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
  if (authUser) {
    navigate("/products");
  }
}, [authUser, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <div className="flex justify-center items-start w-1/2 px-4 mt-17">
          <Card className="w-full max-w-sm shadow-md rounded-2xl min-h-[32rem]">
            <CardHeader className="mt-3 pb-6">
              <CardTitle className="text-lg font-semibold">
                Login to continue
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-2 h-4 w-4 text-gray-500" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="h-10 text-sm pl-8"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-2 h-4 w-4 text-gray-500" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="h-10 text-sm pl-8 pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2 text-gray-500 hover:opacity-80"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex-col gap-3 text-center  pt-4">
              <Link
                to="/signup"
                className="text-sm hover:underline underline-offset-4"
              >
                Don’t have an account? Sign up
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Right side AuthImagePattern */}
        <div className="w-1/2 h-full">
          <AuthImagePattern
            title="Welcome to thriftr"
            subtitle="Buy, Sell, Save, Repeat."
          />
        </div>
      </div>
    </div>
  );
}
