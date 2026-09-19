import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-bold">404</p>

        <h1 className="mt-4 text-3xl font-bold">Page Not Found</h1>

        <p className="mt-3 text-gray-500">
          Sorry, the page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-black px-6 py-3 font-medium text-white"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
