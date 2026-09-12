import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

/** Shared shell for every auth screen (sign in, sign up, ...). */
const AuthLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header variant="solid" />

      <main className="flex-1 px-5 py-14 sm:px-8 sm:py-16">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default AuthLayout;
