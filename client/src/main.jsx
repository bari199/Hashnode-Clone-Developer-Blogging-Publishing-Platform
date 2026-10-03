import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";

import AuthProvider from "./context/AuthContext.jsx";
import SocketProvider from "./socket/SocketProvider.jsx";
import NotificationProvider from "./context/NotificationContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
