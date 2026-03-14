import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronLeftCircle } from "lucide-react";
import { FaArrowCircleLeft } from "react-icons/fa";

interface VerificationBreadcrumbProps {
  type: "agency" | "influencer" | "brand";
  name?: string;
}

const VerificationBreadcrumb = ({
  type,
  name,
}: VerificationBreadcrumbProps) => {
  const typeLabel = type === "agency" ? "Verify Agency" : "Verify Influencer";

  const typePath =
    type === "agency"
      ? "/verification-center/agency"
      : "/verification-center/influencer";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <div className="text-Primary">
          <FaArrowCircleLeft size={35} />
        </div>
        <div>
          {/* Title */}
          <h2 className="font-bold text-Primary text-2xl">
            Verification Center
          </h2>

          {/* Breadcrumb under h2 */}
          <Breadcrumb>
            <BreadcrumbList className="text-sm text-muted-foreground">
              <BreadcrumbItem>
                <BreadcrumbLink href="/verification-center">
                  Verification Center
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink href={typePath}>{typeLabel}</BreadcrumbLink>
              </BreadcrumbItem>

              {name && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </div>
  );
};

export default VerificationBreadcrumb;
