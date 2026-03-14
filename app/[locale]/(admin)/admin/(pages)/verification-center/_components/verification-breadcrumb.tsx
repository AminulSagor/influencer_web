import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { FaArrowCircleLeft } from "react-icons/fa";

const VerificationBreadcrumb = () => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="text-Primary">
          <FaArrowCircleLeft size={35} />
        </Link>

        <div>
          <h2 className="font-bold text-Primary text-2xl">
            Verification Center
          </h2>

          <Breadcrumb>
            <BreadcrumbList className="text-sm text-muted-foreground">
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/verification-center">
                  Verification Center
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </div>
  );
};

export default VerificationBreadcrumb;