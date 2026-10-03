import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar.jsx";
import Navbar from "./Navbar.jsx";

const STORAGE_KEY = "sidebar-collapsed";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia("(min-width: 1024px)").matches,
  );

  // track breakpoint (lg = 1024px)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e) => {
      setIsDesktop(e.matches);
      if (e.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // remember collapsed state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  // the drawer on mobile is always fully expanded
  const isCollapsed = isDesktop && collapsed;

  return (
    <div className="min-h-screen bg-white dark:bg-[#08090b] text-gray-900 dark:text-white">
      {/* ============ SIDEBAR (full height) ============ */}
      <aside
        className={`fixed inset-y-0 left-0 z-[120] border-r border-black/10 dark:border-white/[0.06] bg-gray-50 dark:bg-[#111317] transition-all duration-300 ${
          isCollapsed ? "w-[72px]" : "w-[240px]"
        } ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <LeftSidebar
          collapsed={isCollapsed}
          onToggle={() => setCollapsed((c) => !c)}
          onNavigate={() => setMobileOpen(false)}
        />
      </aside>

      {/* mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[110] bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ============ NAVBAR (sits beside sidebar) ============ */}
      <Navbar
        onMenuClick={() => setMobileOpen(true)}
        className={`transition-all duration-300 ${
          collapsed ? "lg:left-[72px]" : "lg:left-[240px]"
        }`}
        showLogo={false}
      />

      {/* ============ PAGE CONTENT ============ */}
      <div
        className={`min-h-screen pt-16 transition-all duration-300 ${
          collapsed ? "lg:ml-[72px]" : "lg:ml-[240px]"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
