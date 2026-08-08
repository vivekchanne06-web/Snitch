import { Outlet } from "react-router-dom";
import Navbar from "../shared/components/Navbar";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F5]">
      {/* ONE shared Navbar instance across the entire application */}
      <Navbar />

      {/* Global layout offset for the 72px fixed Navbar */}
      <main className="pt-[72px]">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;