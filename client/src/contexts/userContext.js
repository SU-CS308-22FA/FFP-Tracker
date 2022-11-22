import { useState, createContext, useEffect } from "react";
import FFP_API from "../app/api";

export const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [login, setLogin] = useState(sessionStorage.getItem("login"));
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));

  useEffect(() => {
    const fetchUser = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      await FFP_API.request("/users", requestOptions).then((res) => {
        if (res.status !== 200) {
          setToken(null);
          setLogin(false);
          setUser(null);
        }
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("login", login);
        sessionStorage.setItem("user", JSON.stringify(user));
      });
    };
    fetchUser();
  }, [token, login, user]);

  return (
    <UserContext.Provider
      value={{
        token,
        setToken,
        login,
        setLogin,
        user,
        setUser,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
