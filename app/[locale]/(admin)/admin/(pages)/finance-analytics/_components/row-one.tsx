import React from "react";

const RowOne = () => {
  return (
    <>
      <div className="col-span-12 md:col-span-6 space-y-2">
        <div className="bg-linear-to-r from-Primary to-light-green rounded-md p-2">
          <div className="text-white-two space-y-2">
            <p>Gross Revenue</p>
            <div className="flex items-center justify-between">
              <p className="text-xl font-semibold">৳5,25,000</p>
              <p>12.5% from last month</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="bg-linear-to-r from-Primary to-light-green rounded-md p-2 flex-1">
            <div className="text-white-two space-y-2">
              <p>Net Profit</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-semibold">৳5,25,000</p>
                <p></p>
              </div>
            </div>
          </div>
          <div className="bg-linear-to-r from-white to-Secondary rounded-md p-2 flex-1 border border-light-green">
            <div className="text-light-green space-y-2">
              <p>Total Pending Profit</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-semibold">৳5,25,000</p>
                <p></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 md:col-span-6">
        <div className="shadow bg-linear-to-r from-white to-Secondary rounded-md p-2 flex-1">
          <div className="text-light-green space-y-2">
            <p>Total Pending Payout</p>
            <div className="flex items-center justify-between">
              <p className="text-xl font-semibold">৳5,25,000</p>
              <p></p>
            </div>
            <div className="flex justify-between">
              <p>Agency: ৳300,000</p>
              <p className="text-orange">Influencer: ৳150,000</p>
            </div>
            <div>
              {/* Progress Bar */}
              <div className="w-full h-3 rounded-full bg-gray-700 overflow-hidden flex">
                <div
                  className="h-full bg-light-green"
                  style={{ width: "66.7%" }}
                />
                <div className="h-full bg-orange" style={{ width: "33.3%" }} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="w-4 aspect-square bg-light-green rounded-full"></div>
                <p className="text-sm font-semibold">66.7% Agency</p>
              </div>
              <div className="flex items-center gap-1">
                <p className="text-orange text-sm font-semibold">
                  33.3% Influencer
                </p>
                <div className="w-4 aspect-square bg-orange rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RowOne;
