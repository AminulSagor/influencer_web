import { Control, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { FormType } from "./milestone-card";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  control: Control<FormType>;
  submissionIndex: number;
}

const SubmissionProofs = ({ control, submissionIndex }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `submissions.${submissionIndex}.proofs`,
  });

  return (
    <div className="space-y-4">
      {fields.map((field, proofIndex) => (
        <Card key={field.id}>
          <CardContent className="space-y-4">
            <div className="flex justify-end">
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => remove(proofIndex)}
                >
                  <TrashIcon />
                </Button>
              )}
            </div>

            <Input
              {...control.register(
                `submissions.${submissionIndex}.proofs.${proofIndex}.liveLink`
              )}
              placeholder="Live Link"
            />

            <Input
              {...control.register(
                `submissions.${submissionIndex}.proofs.${proofIndex}.performanceMetric`
              )}
              placeholder="Performance Metrics"
            />

            <Input
              {...control.register(
                `submissions.${submissionIndex}.proofs.${proofIndex}.attachment`
              )}
              placeholder="Payment Proof / Attachment URL"
            />
          </CardContent>
        </Card>
      ))}

      <button
        type="button"
        className="border border-light-green rounded-lg border-dashed py-6 w-full text-light-green font-semibold cursor-pointer hover:bg-light-green hover:text-white transition-all duration-150"
        onClick={() =>
          append({
            liveLink: "",
            performanceMetric: "",
            attachment: "",
          })
        }
      >
        + Add Another Proof
      </button>
    </div>
  );
};

export default SubmissionProofs;
