import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";

const ProtectedRoute = () => {
  const { status } = useAuth();

  // Authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // User logged in
  if (status !== "authenticated") {
    return <Navigate to="/login" replace />;
  }

  // Authenticated
  return <Outlet />;
};

export default ProtectedRoute;
