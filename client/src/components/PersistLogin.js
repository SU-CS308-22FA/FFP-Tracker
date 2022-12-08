import React from "react";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/userContext";
import FFP_API from "../app/api";
import { Navigate, Outlet } from "react-router-dom";
import CircularProgressComponent from "./Public Components/CircularProgressComponent";

export default function PersistLogin() {
  const { login, setLogin, token, setToken, user, setUser } =
    useContext(UserContext);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        await FFP_API.request("/users/me", requestOptions).then((res) => {
          setUser(res.data);
        });
      } catch (err) {
        setLogin(false);
        setToken(null);
        setUser(null);
      }
    };
    fetchUser();
    setLoading(false);
  }, [setLogin, setToken, setUser, token]);
  if (!login) {
    return <Navigate to="/login" />;
  }
  if (loading || !user) {
    return <CircularProgressComponent />;
  } else {
    return <Outlet />;
  }
}
