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
  let typeLabel = type === "agency" ? "Agency" : "Influencer";
  if(type === "brand"){
    typeLabel = "Brand";
  }


  const typePath =
    type === "agency"
      ? "/users/agency"
      : "/users/influencer";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <div className="text-Primary">
          <FaArrowCircleLeft size={35} />
        </div>
        <div>
          {/* Title */}
          <h2 className="font-bold text-Primary text-2xl">
            Browse User
          </h2>

          {/* Breadcrumb under h2 */}
          <Breadcrumb>
            <BreadcrumbList className="text-sm text-muted-foreground">
              <BreadcrumbItem>
                <BreadcrumbLink href="/en/admin/users/influencer">
                  Browse User
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
