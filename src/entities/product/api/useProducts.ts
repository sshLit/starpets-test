import { useQuery } from '@tanstack/vue-query';
import type { MaybeRefOrGetter } from 'vue';
import { computed, watch, toValue } from 'vue';
import type { FetchProductsRequest, FetchProductsResponse } from '~/shared/types/product';
import { productApi } from './index';

export function useProductQuery(
  queryParams: MaybeRefOrGetter<FetchProductsRequest>,
  syncToStore?: (response: FetchProductsResponse) => void,
) {
  const normalizedParams = computed(() => toValue(queryParams));
  const isClient = import.meta.client;

  const query = useQuery({
    queryKey: computed(() => ['product-query', normalizedParams.value]),
    queryFn: async (): Promise<FetchProductsResponse> => {
      return productApi.fetchProducts(normalizedParams.value);
    },
    enabled: isClient,
  });

  if (syncToStore && isClient) {
    watch(
      () => query.data.value,
      (data) => {
        if (data) {
          syncToStore(data);
        }
      },
      { immediate: true },
    );
  }

  return query;
}
