import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar.jsx";
const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#08090b] text-white">
      {" "}
      {/* ===================================================== LEFT SIDEBAR Starts below the navbar ===================================================== */}{" "}
      <aside className=" fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-[168px] border-r border-white/[0.06] bg-[#111317] lg:block ">
        {" "}
        <div className="h-full overflow-y-auto px-4 py-4">
          {" "}
          <LeftSidebar />{" "}
        </div>{" "}
      </aside>{" "}
      {/* ===================================================== PAGE CONTENT Starts below navbar and beside sidebar ===================================================== */}{" "}
      <div className="min-h-screen pt-16 lg:ml-[168px]">
        {" "}
        <Outlet />{" "}
      </div>{" "}
    </div>
  );
};
export default MainLayout;
