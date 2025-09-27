import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  // will recieve some of the first props. It will receive wether the use is authenticated or not, next it will receive user information like if the user is authenticated. So user will have a name email or password, then it will receive the children, children is nothing but a component we want to render

  //instead of location.pathname.includes("/...")
  const location = useLocation();
  const { pathname } = location;

  // console.log("pathname: " + pathname, "is Authenticated? " + isAuthenticated);

  if (pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    } else {
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/shop/home" />;
      }
    }
  }

  // Redirect unauthenticated users away from restricted pages
  if (
    !isAuthenticated &&
    !(pathname.includes("/login") || pathname.includes("/register"))
  ) {
    return <Navigate to="/auth/login" />;
  }

  // Redirect authenticated users away from login/register pages
  if (
    isAuthenticated &&
    (pathname.includes("/login") || pathname.includes("/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  // Redirect based on user role and page access
  if (isAuthenticated && user?.role !== "admin" && pathname.includes("admin")) {
    return <Navigate to="/unauth-page" />;
  }

  if (isAuthenticated && user?.role === "admin" && pathname.includes("shop")) {
    return <Navigate to="/admin/dashboard" />;
  }

  // Render the children component if no conditions are met
  return <>{children}</>;
}

export default CheckAuth;
