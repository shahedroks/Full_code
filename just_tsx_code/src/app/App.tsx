import { useState, useEffect } from "react";
import { LoginScreen } from "@/app/components/auth/LoginScreen";
import { RegisterScreen } from "@/app/components/auth/RegisterScreen";
import { CustomerApp } from "@/app/CustomerApp";
import { ProviderApp } from "@/app/ProviderApp";
import { AuthService } from "@/services/AuthService";
import type { User } from "@/domain/auth";

type AuthFlow = "login" | "register";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(
    null,
  );
  const [authFlow, setAuthFlow] = useState<AuthFlow>("login");
  const [loading, setLoading] = useState(true);

  const authService = AuthService.getInstance();

  useEffect(() => {
    // Check if user is already authenticated
    const session = authService.getCurrentSession();
    if (session) {
      setCurrentUser(session.user);
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleRegisterSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleUpdateUser = (updatedFields: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updatedFields };
      setCurrentUser(updatedUser);
      
      // Update the session in AuthService
      const session = authService.getCurrentSession();
      if (session) {
        authService.updateSession({ ...session, user: updatedUser });
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#408AF1] to-[#5ca3f5]">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated - show auth screens
  if (!currentUser) {
    if (authFlow === "register") {
      return (
        <RegisterScreen
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setAuthFlow("login")}
        />
      );
    }

    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setAuthFlow("register")}
      />
    );
  }

  // Authenticated - show appropriate app based on role
  if (currentUser.role === "provider") {
    return (
      <ProviderApp user={currentUser} onLogout={handleLogout} />
    );
  }

  // Default to customer app
  return (
    <CustomerApp user={currentUser} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
  );
}