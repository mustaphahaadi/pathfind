import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

/** Shared shell for generic content pages (About, How It Works, Stories, ...). */
const ContentLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header variant="solid" />

      <main className="flex flex-1 flex-col items-center justify-center px-5 py-20 text-center">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default ContentLayout;
