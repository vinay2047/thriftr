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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Eye, EyeOff, Lock } from "lucide-react";
import AuthImagePattern from "@/components/AuthImagePattern";
import Navbar from "@/components/Navbar";

export default function SignupPage() {
  const { signup, isLoading, authUser } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.role === "seller") {
      navigate(
        `/seller-details?name=${encodeURIComponent(
          formData.name
        )}&email=${encodeURIComponent(
          formData.email
        )}&password=${encodeURIComponent(formData.password)}`
      );
    } else {
      signup(formData as any);
      if (authUser) {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <div className="flex justify-center items-start w-1/2 ml-1 mt-17">
          <Card className="w-full max-w-sm shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Signup to get started
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="relative flex items-center">
                    <User className="absolute left-2 h-4 w-4 text-gray-500" />
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="h-9 text-sm pl-8"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
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
                      className="h-9 text-sm pl-8"
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
                      className="h-9 text-sm pl-8 pr-8"
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

                <div className="grid gap-2">
                  <Label>Role</Label>
                  <Tabs
                    defaultValue="buyer"
                    className="w-full"
                    onValueChange={(val) =>
                      setFormData((prev) => ({ ...prev, role: val }))
                    }
                  >
                    <TabsList className="grid grid-cols-2 w-full">
                      <TabsTrigger value="buyer">Buyer</TabsTrigger>
                      <TabsTrigger value="seller">Seller</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing up..." : "Sign Up"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-center">
              <Link
                to="/login"
                className="text-sm hover:underline underline-offset-4"
              >
                Already have an account? Login
              </Link>
            </CardFooter>
          </Card>
        </div>
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
