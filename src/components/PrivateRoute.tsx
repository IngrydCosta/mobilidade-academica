import { Navigate, Outlet } from "react-router-dom";

type PrivateRouteProps = {
  allowedRoles?: string[];
};

export default function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!user || !user.perfil || !allowedRoles.includes(user.perfil)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
}
