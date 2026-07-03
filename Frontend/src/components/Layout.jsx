
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
function Layout() {
  const { isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  const location = useLocation();

  // Routes where header should not be shown
  const hideHeaderRoutes = ["/dashboard", "/login", "/signup"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {!shouldHideHeader && <Header />}
      <main className={shouldHideHeader ? "" : "pt-0"}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
