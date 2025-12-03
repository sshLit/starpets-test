import api from '~/shared/api/http';
import type { FetchProductsRequest, FetchProductsResponse } from '~/shared/types/product';

export const productApi = {
  fetchProducts: async (params: FetchProductsRequest): Promise<FetchProductsResponse> => {
    return api.post<FetchProductsResponse>('https://market.apineural.com/api/store/items/all', params);
  },
};
