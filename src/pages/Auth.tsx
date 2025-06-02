import React from "react";
import { Navigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuth } from "@/contexts/AuthContext";

export default function Auth() {
  const { isAuthenticated } = useAuth();
  const [mode, setMode] = React.useState<"login" | "register">("login");

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/gallery" replace />;
  }

  const handleSuccess = () => {
    // The AuthContext will handle the redirect through the router
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {mode === "login" ? (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchToRegister={() => setMode("register")}
          />
        ) : (
          <RegisterForm
            onSuccess={handleSuccess}
            onSwitchToLogin={() => setMode("login")}
          />
        )}
      </div>
    </div>
  );
}
