import { UserContext } from "../contexts/userContext";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireAuth({ allowedRoles }) {
  const { user } = useContext(UserContext);
  if (!user) {
    return <Navigate to="/login" />;
  } else if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  } else {
    return <Outlet />;
  }
}
