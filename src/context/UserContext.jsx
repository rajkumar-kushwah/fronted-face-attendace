// client/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../utils/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // 🔹 USER STATE (safe parse)
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [loading, setLoading] = useState(!user);

  // 🔹 UPDATE USER
  const updateUser = (data) => {
    if (!data) return;
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  // 🔹 LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // 🔹 FETCH USER PROFILE
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await getProfile();
        if (res.data && res.data._id) updateUser(res.data); // only update if real user
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser: updateUser,
        logout,
        loading,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
