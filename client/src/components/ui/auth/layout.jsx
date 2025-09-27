import { Outlet } from "react-router-dom";

{
  /* The path "/auth" in app.jsx is always common so that we created a common layout, and the advantage is that you don't need to write more layout code like this  every time in all the pages*/
}

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex items-center justify-center bg-black w-1/2 px-12">
        <div className="max-w-md space-y-6 text-center text-primary-foreground">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome to ECommerce Shopping!
          </h1>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        {/* here we need to render all the common components */}
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
