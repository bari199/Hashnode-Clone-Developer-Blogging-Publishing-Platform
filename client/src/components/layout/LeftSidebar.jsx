import {
  Home,
  Sparkles,
  Hash,
  Bookmark,
  Users,
  MessageSquare,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import SidebarItem from "./SidebarItem.jsx";
const LeftSidebar = ({ activeItem = "Feed" }) => {
  return (
    <div className="flex min-h-full flex-col">
      {" "}
      {/* ===================================================== MAIN NAVIGATION ===================================================== */}{" "}
      <nav className="space-y-1">
        {" "}
        <SidebarItem
          icon={<Home className="h-4 w-4" />}
          label="Feed"
          active={activeItem === "Feed"}
        />{" "}
        <SidebarItem
          icon={<Sparkles className="h-4 w-4" />}
          label="Explore"
          active={activeItem === "Explore"}
        />{" "}
        <SidebarItem
          icon={<Hash className="h-4 w-4" />}
          label="Topics"
          active={activeItem === "Topics"}
        />{" "}
        <SidebarItem
          icon={<Bookmark className="h-4 w-4" />}
          label="Bookmarks"
          active={activeItem === "Bookmarks"}
        />{" "}
      </nav>{" "}
      <Separator className="my-5 bg-white/[0.06]" />{" "}
      {/* ===================================================== COMMUNITY ===================================================== */}{" "}
      <div>
        {" "}
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
          {" "}
          Community{" "}
        </p>{" "}
        <nav className="space-y-1">
          {" "}
          <SidebarItem
            icon={<Users className="h-4 w-4" />}
            label="Authors"
            active={activeItem === "Authors"}
          />{" "}
          <SidebarItem
            icon={<MessageSquare className="h-4 w-4" />}
            label="Discussions"
            active={activeItem === "Discussions"}
          />{" "}
        </nav>{" "}
      </div>{" "}
      <Separator className="my-5 bg-white/[0.06]" />{" "}
      {/* ===================================================== DESCRIPTION ===================================================== */}{" "}
      <div className="px-2">
        {" "}
        <p className="text-[11px] leading-5 text-zinc-600">
          {" "}
          Build in public. <br /> Learn. Share. Connect.{" "}
        </p>{" "}
      </div>{" "}
    </div>
  );
};
export default LeftSidebar;
