type Props = {
  reason: string;
};

export default function SubmissionDeclineReason({ reason }: Props) {
  return (
    <div className="h-full">
      <p className="text-sm font-semibold text-[#FF1616]">Declined Reason</p>
      <div className="mt-3 min-h-[112px] rounded-[10px] border border-[#FF1616] bg-white p-4 text-sm leading-relaxed text-black/80">
        {reason}
      </div>
    </div>
  );
}
