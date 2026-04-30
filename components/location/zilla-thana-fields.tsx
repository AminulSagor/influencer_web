"use client";

import { useCallback, useEffect, useState } from "react";
import LocationSearchSelect from "@/components/location/location-search-select";
import { getThanasByZillaId, getZillas } from "@/service/common/location/location";

type ZillaThanaFieldsProps = {
  zilla: string;
  thana: string;
  onZillaChange: (value: string) => void;
  onThanaChange: (value: string) => void;
  disabled?: boolean;
  zillaLabel?: string;
  thanaLabel?: string;
  zillaPlaceholder?: string;
  thanaPlaceholder?: string;
  fieldClassName?: string;
  selectClassName?: string;
};

const ZillaThanaFields = ({
  zilla,
  thana,
  onZillaChange,
  onThanaChange,
  disabled = false,
  zillaLabel = "Zilla *",
  thanaLabel = "Thana *",
  zillaPlaceholder = "Select Zilla",
  thanaPlaceholder = "Select Thana",
  fieldClassName = "space-y-2",
  selectClassName = "",
}: ZillaThanaFieldsProps) => {
  const [selectedZillaId, setSelectedZillaId] = useState("");
  const [isResolvingZilla, setIsResolvingZilla] = useState(false);

  useEffect(() => {
    if (!zilla?.trim()) {
      setSelectedZillaId("");
      return;
    }

    let isActive = true;

    const resolveZillaId = async () => {
      try {
        setIsResolvingZilla(true);
        const response = await getZillas({
          page: 1,
          limit: 10,
          search: zilla,
        });
        const normalizedZilla = zilla.trim().toLowerCase();
        const matched =
          response.data.find(
            (item) => item.name.trim().toLowerCase() === normalizedZilla,
          ) ?? response.data[0];

        if (isActive) {
          setSelectedZillaId(matched?.id ?? "");
        }
      } catch {
        if (isActive) setSelectedZillaId("");
      } finally {
        if (isActive) setIsResolvingZilla(false);
      }
    };

    void resolveZillaId();

    return () => {
      isActive = false;
    };
  }, [zilla]);

  const fetchThanas = useCallback(
    (params: { page: number; limit: number; search: string }) => {
      if (!selectedZillaId) {
        return Promise.resolve({
          success: true,
          data: [],
          meta: { total: 0, page: 1, limit: params.limit, totalPages: 1 },
        });
      }

      return getThanasByZillaId({
        zillaId: selectedZillaId,
        ...params,
      });
    },
    [selectedZillaId],
  );

  return (
    <>
      <div className={fieldClassName}>
        <label className="text-sm font-medium text-light-green">{zillaLabel}</label>
        <LocationSearchSelect
          value={zilla}
          placeholder={zillaPlaceholder}
          disabled={disabled}
          fetchOptions={getZillas}
          onSelect={(item) => {
            setSelectedZillaId(item.id);
            onZillaChange(item.name);
            onThanaChange("");
          }}
          className={selectClassName}
        />
      </div>

      <div className={fieldClassName}>
        <label className="text-sm font-medium text-light-green">{thanaLabel}</label>
        <LocationSearchSelect
          value={thana}
          placeholder={
            zilla
              ? isResolvingZilla
                ? "Loading Thanas..."
                : thanaPlaceholder
              : "Select Zilla first"
          }
          disabled={disabled || !zilla || !selectedZillaId || isResolvingZilla}
          fetchOptions={fetchThanas}
          onSelect={(item) => onThanaChange(item.name)}
          className={selectClassName}
        />
      </div>
    </>
  );
};

export default ZillaThanaFields;
