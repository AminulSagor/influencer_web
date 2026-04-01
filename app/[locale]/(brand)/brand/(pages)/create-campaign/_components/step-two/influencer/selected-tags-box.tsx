import { X } from "lucide-react";

type SelectedTagsBoxProps = {
  tags: string[];
  onRemove: (tag: string) => void;
};

const SelectedTagsBox = ({ tags, onRemove }: SelectedTagsBoxProps) => {
  return (
    <div className="min-h-44 rounded-xl border border-light-gray p-3">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex h-8 items-center gap-1 rounded-full bg-Secondary px-3 py-1 text-sm text-Primary"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemove(tag)}
              aria-label={`Remove ${tag}`}
              className="opacity-60 hover:opacity-100"
            >
              <X className="h-3.5 w-3.5 cursor-pointer" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default SelectedTagsBox;