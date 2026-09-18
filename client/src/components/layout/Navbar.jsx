import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";

const Navbar = () => {
  const { user, status, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          DevBlog
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <Link to="/tags" className="text-gray-700 hover:text-black">
            Tags
          </Link>
          {status === "authenticated" ? (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-black">
                Dashboard
              </Link>

              <Link
                to={`/profile/${user?._id}`}
                className="text-gray-700 hover:text-black"
              >
                {user?.name}
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-black">
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
