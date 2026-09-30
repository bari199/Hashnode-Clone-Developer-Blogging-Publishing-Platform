import { Link } from "react-router-dom";

const SidebarItem = ({
  icon: Icon,
  label,
  to,
  active = false,
  collapsed = false,
  onClick,
  trailing,
}) => {
  const className = `group relative flex w-full items-center rounded-lg text-sm transition ${
    collapsed ? "h-10 justify-center" : "gap-3 px-3 py-2"
  } ${
    active
      ? "bg-white/[0.08] text-white"
      : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100"
  }`;

  const content = (
    <>
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="flex-1 truncate text-left">{label}</span>}
      {!collapsed && trailing}
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        onClick={onClick}
        title={collapsed ? label : undefined}
        className={className}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={className}
    >
      {content}
    </button>
  );
};

export default SidebarItem;
