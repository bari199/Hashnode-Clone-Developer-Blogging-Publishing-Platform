const SidebarItem = ({ icon, label, active = false, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
        active
          ? "bg-white/[0.08] text-white"
          : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
      }`}
    >
      {icon}

      <span>{label}</span>
    </button>
  );
};

export default SidebarItem;
