type Props = {
  reason: string;
};

export default function SubmissionDeclineReason({ reason }: Props) {
  return (
    <div>
      <p className="text-sm font-semibold text-red-500">Declined Reason</p>
      <div className="mt-3 rounded-[10px] border border-red-400 bg-white p-4 text-sm text-black/80">
        {reason}
      </div>
    </div>
  );
}