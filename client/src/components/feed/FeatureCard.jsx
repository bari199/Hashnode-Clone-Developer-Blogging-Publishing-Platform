const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-[#0b0d10] p-5 transition hover:bg-white/[0.03]">
      <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-zinc-400">
        <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      </div>

      <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-zinc-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
