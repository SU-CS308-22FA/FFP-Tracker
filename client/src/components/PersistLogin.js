import React from "react";
import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../contexts/userContext";
import FFP_API from "../app/api";
import { Navigate, Outlet } from "react-router-dom";
import CircularProgressComponent from "./Public Components/CircularProgressComponent";

export default function PersistLogin() {
  const { login, setLogin, token, setToken, user, setUser } =
    useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const effectRan = useRef(false);
  useEffect(() => {
    if (effectRan.current === false) {
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
            console.log(res.data);
            setUser(res.data);
          });
        } catch (err) {
          setLogin(false);
          setToken(null);
        }
      };
      fetchUser();
      setLoading(false);
      return () => {
        effectRan.current = true;
      };
    }
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
