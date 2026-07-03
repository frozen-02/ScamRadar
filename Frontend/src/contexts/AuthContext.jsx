import React, { createContext, useContext, useState, useEffect } from "react";
import checkUserAuthLoader from "../AuthLoader";
import toast from "react-hot-toast";
import axios from "axios";
import {API_ENDPOINTS} from "../config/api"

const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await checkUserAuthLoader();
        console.log(response.userid);
        setUser(response.userid);
        setIsAuthenticated(true); 
        console.log("User authenticated");
      } catch (error) {
        console.log("User not authenticated");
        setUser(null);
        setIsAuthenticated(false); 
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []);


  const logout = async (navigate) => {
    try {
      const loadingToast = toast.loading("Signing out...");
      
      const response = await axios.get(
        API_ENDPOINTS.AUTH.LOGOUT,
        {
          withCredentials: true,
        }
      );
      
      if (response.data?.msg === "success") {
        setUser(null);
        setIsAuthenticated(false);
        toast.success("Successfully signed out!", { id: loadingToast });
        if (navigate) {
          navigate("/");
        }
      } else {
        console.log("An error occurred");
        toast.error("Logout failed. Please try again.", { id: loadingToast });
      }
    } catch (error) {
      console.error("Logout error:", error.response || error);
      const message = error.response?.data?.error || "Unknown error occurred";
      toast.error(`Logout failed: ${message}`, { id: loadingToast });
      
      // Even if logout API fails, clear client-side state
      setUser(null);
      setIsAuthenticated(false);
      if (navigate) {
        navigate("/");
      }
    }
  };
  
  return (
    <AuthContext.Provider value={{ isLoading, user, setUser, isAuthenticated, setIsAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
