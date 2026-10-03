const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-5 transition hover:bg-black/[0.03] dark:bg-[#0b0d10] dark:hover:bg-white/[0.03]">
      <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-black/[0.06] text-zinc-500 dark:bg-white/[0.06] dark:text-zinc-400">
        <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      </div>

      <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-600">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
