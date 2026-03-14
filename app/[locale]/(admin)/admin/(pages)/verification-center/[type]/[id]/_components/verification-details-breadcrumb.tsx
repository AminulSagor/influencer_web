import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { FaArrowCircleLeft } from "react-icons/fa";

interface Props {
  type: string;
  name: string;
}

const VerificationDetailsBreadcrumb = ({ type, name }: Props) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <Link href="/admin/verification-center" className="text-Primary">
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

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/verification-center">
                  Verify {type}
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>{name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </div>
  );
};

export default VerificationDetailsBreadcrumb;