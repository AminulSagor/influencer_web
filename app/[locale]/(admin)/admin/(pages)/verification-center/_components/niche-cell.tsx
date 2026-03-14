import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const NicheCell = ({ niches }: { niches: string[] }) => {
  const maxShow = 2;
  const visibleNiches = niches.slice(0, maxShow);
  const hiddenCount = niches.length - maxShow;
  const hiddenNiches = niches.slice(maxShow);

  return (
    <div>
      {visibleNiches.join(", ")}
      {hiddenCount > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="ml-1 text-light-green cursor-pointer underline  text-sm">
              +{hiddenCount} more
            </p>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="start" className="max-w-xs">
            <ul className="text-sm list-disc list-inside">
              {hiddenNiches.map((niche, idx) => (
                <li key={idx}>{niche}</li>
              ))}
            </ul>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default NicheCell;
