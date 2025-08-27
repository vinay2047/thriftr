import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import SignupPage from "./pages/signup/SignupPage";
import SellerDetailsPage from "./pages/signup/components/SellerDetailsPage";
import LoginPage from "./pages/login/LoginPage";
import { Toaster } from "sonner";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster position="top-center"/>
      <Routes>
        <Route path="/signup" element={<SignupPage/>} />
        <Route path="/seller-details" element={<SellerDetailsPage/>} />
        <Route path="/" element={<h1>Register</h1>} />
        <Route path="/login" element={<LoginPage/>} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
