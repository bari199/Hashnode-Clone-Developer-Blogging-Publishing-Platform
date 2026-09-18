import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";

const ProtectedRoute = () => {
  const { status } = useAuth();

  // Authentication যাচাই হচ্ছে
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // User logged in না থাকলে login page-এ পাঠাবে
  if (status !== "authenticated") {
    return <Navigate to="/login" replace />;
  }

  // Authenticated হলে child route render করবে
  return <Outlet />;
};

export default ProtectedRoute;
