
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import SignupPage from "./pages/signup/SignupPage";
import SellerDetailsPage from "./pages/signup/components/SellerDetailsPage";
import LoginPage from "./pages/login/LoginPage";
import { Toaster } from "sonner";
import HomePage from "./pages/home/HomePage";
import ProductsPage from "./pages/products/ProductsPage";
import ProductDetails from "./pages/products/components/ProductDetails";
import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore";

function App() {
  const {checkAuth}=useAuthStore()
  useEffect(() => {
    checkAuth()
  },[])
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster position="top-center"/>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path="/seller-details" element={<SellerDetailsPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/products" element={<ProductsPage/>} />
        <Route path="/products/:productId" element={<ProductDetails />} />
        <Route path="/IIT2024194/healthz" element={<div>Frontend Alive!</div>} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
