import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  ownerInfo: {
    firstName?: string;
    lastName?: string;
  };
  contactInfo: {
    email?: string;
    phone?: string;
    secondaryPhone?: string;
  };
  address: {
    title?: string;
    value?: string;
  };
  serviceFee?: string;
}

const BrandProfileDetailsCard = ({
  ownerInfo,
  contactInfo,
  address,
  serviceFee,
}: Props) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-Primary text-base">
          Profile Details
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                First Name
              </h3>
              <p className="text-Primary font-medium">
                {ownerInfo.firstName || "N/A"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Last Name
              </h3>
              <p className="text-Primary font-medium">
                {ownerInfo.lastName || "N/A"}
              </p>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Email Address
              </h3>
              <p className="text-Primary font-medium">
                {contactInfo.email || "N/A"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Phone Number
              </h3>
              <p className="text-Primary font-medium">
                {contactInfo.phone || "N/A"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Secondary Phone Number
              </h3>
              <p className="text-Primary font-medium">
                {contactInfo.secondaryPhone || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {address.title || "Address"}
              </h3>
              <p className="text-Primary font-medium">
                {address.value || "N/A"}
              </p>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="rounded-lg border p-4 h-full flex flex-col justify-center">
              <h3 className="text-sm font-medium text-muted-foreground">
                Service Fee
              </h3>
              <p className="text-Primary font-semibold text-xl">
                {serviceFee || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandProfileDetailsCard;