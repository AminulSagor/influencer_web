export type LocationLookupItem = {
  id: string;
  name: string;
  bnName?: string | null;
  zillaId?: string;
};

export type LocationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type LocationListResponse = {
  success: boolean;
  data: LocationLookupItem[];
  meta: LocationMeta;
};

export type GetZillasParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type GetThanasParams = GetZillasParams & {
  zillaId: string;
};
