import { useState } from "react";
import axios from "axios";
import backendApi from "../BackendApi";

const useAuthentication = () => {
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("token") ? true : false
  );
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    try {
      const response = await axios.post(
        `${backendApi}/auth/login`,
        credentials
      );
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      setAuthenticated(true);
      setUser(user);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
    setUser(null);
  };

  const isAuthenticated = () => {
    return authenticated;
  };

  const isAdmin = () => {
    return user && user.role === "Admin";
  };

  return { isAuthenticated, isAdmin, login, logout };
};

export default useAuthentication;
