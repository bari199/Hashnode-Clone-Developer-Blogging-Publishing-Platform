import { Link } from "react-router-dom";

const TagPill = ({ tag }) => {
  return (
    <Link
      to={`/tag/${tag.slug}`}
      className="rounded-full border px-4 py-2 text-sm hover:bg-gray-100"
    >
      #{tag.name}
    </Link>
  );
};

export default TagPill;
