import { UserContext } from "../contexts/userContext";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireAuth({ allowedRoles }) {
  console.log("Here!");
  console.log(allowedRoles);
  const { user } = useContext(UserContext);
  if (!user) {
    console.log("No user!");
    return <Navigate to="/login" />;
  } else if (!allowedRoles.includes(user.role)) {
    console.log(user);
    console.log("No role!");
    return <Navigate to="/login" />;
  } else {
    return <Outlet />;
  }
}
