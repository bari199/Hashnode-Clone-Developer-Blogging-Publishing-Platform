import { createContext, useEffect, useState } from "react";
import api from "../api/axios.js";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setStatus("guest");
        return;
      }

      try {
        const response = await api.get("/auth/me");

        setUser(response.data.user);
        setStatus("authenticated");
      } catch (error) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setStatus("guest");
      }
    };

    loadUser();
  }, [token]);

  const login = (userData, userToken) => {
    localStorage.setItem("token", userToken);

    setToken(userToken);
    setUser(userData);
    setStatus("authenticated");
  };

  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
    setStatus("guest");
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        status,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
