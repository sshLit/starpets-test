import { computed } from 'vue';
import type { FetchProductsRequest, FetchProductsResponse, Product, ProductFilterType, ProductLevel, ProductRarity } from '~/shared/types/product';
import { productApi } from '../api';

const uiRarityColorList = ['blue', 'purple', 'green', 'red', 'grey'] as const;

const backendRarityMapping: Record<string, ProductRarity> = {
  blue: 'common',
  purple: 'uncommon',
  green: 'rare',
  red: 'ultra_rare',
  grey: 'legendary',
};

const backendPropertyMapping: Record<string, 'default' | 'neon' | 'mega_neon' | 'flyable' | 'rideable'> = {
  regular: 'default',
  neon: 'neon',
  mega: 'mega_neon',
  fly: 'flyable',
  raid: 'rideable',
};

export const useProductsStore = defineStore('productsStore', () => {
  const items = ref<Product[]>([]);
  const loadingState = ref(false);
  const errorState = ref<string | null>(null);
  const activePage = ref(1);
  const pagesCount = ref(1);
  const itemsCount = ref(0);

  const rarityFilterIndices = ref<number[]>([]);
  const propertyFilters = ref<string[]>([]);
  const currentSortType = ref<'popularity' | 'price'>('popularity');
  const typeFilters = ref<('egg' | 'pet' | 'potion')[]>([]);

  const activeRarities = computed<ProductRarity[]>(() => {
    return rarityFilterIndices.value
      .map((index) => uiRarityColorList[index])
      .filter((color): color is string => Boolean(color))
      .map((color) => backendRarityMapping[color])
      .filter((rarity): rarity is ProductRarity => Boolean(rarity));
  });

  const activeLevels = computed<ProductLevel[]>(() => {
    return propertyFilters.value
      .map((prop) => backendPropertyMapping[prop])
      .filter((value): value is ProductLevel => value === 'default' || value === 'neon' || value === 'mega_neon');
  });

  const backendPropertyFilter = computed(() => {
    const hasFlyableProperty = propertyFilters.value.some((prop) => backendPropertyMapping[prop] === 'flyable');
    const hasRideableProperty = propertyFilters.value.some((prop) => backendPropertyMapping[prop] === 'rideable');

    if (!hasFlyableProperty && !hasRideableProperty) {
      return undefined;
    }

    return {
      missing: false,
      ...(hasFlyableProperty && { flyable: true }),
      ...(hasRideableProperty && { rideable: true }),
    };
  });

  function updateItems(newItems: Product[]) {
    items.value = newItems;
  }

  function appendItems(additionalItems: Product[]) {
    items.value = [...items.value, ...additionalItems];
  }

  function resetItems() {
    items.value = [];
  }

  function updatePage(pageNumber: number) {
    activePage.value = pageNumber;
  }

  function updatePagesCount(count: number) {
    pagesCount.value = count;
  }

  function updateItemsCount(count: number) {
    itemsCount.value = count;
  }

  function updateError(errorMessage: string | null) {
    errorState.value = errorMessage;
  }

  function updateLoadingState(isLoading: boolean) {
    loadingState.value = isLoading;
  }

  function switchRarityFilter(index: number) {
    const existingIndex = rarityFilterIndices.value.indexOf(index);

    if (existingIndex > -1) {
      rarityFilterIndices.value.splice(existingIndex, 1);
    } else {
      rarityFilterIndices.value.push(index);
    }
  }

  function resetRarityFilters() {
    rarityFilterIndices.value = [];
  }

  function switchPropertyFilter(propertyType: string) {
    const existingIndex = propertyFilters.value.indexOf(propertyType);

    if (existingIndex > -1) {
      propertyFilters.value.splice(existingIndex, 1);
    } else {
      propertyFilters.value.push(propertyType);
    }
  }

  function resetPropertyFilters() {
    propertyFilters.value = [];
  }

  function changeSortType(sortType: 'popularity' | 'price') {
    currentSortType.value = sortType;
  }

  function switchTypeFilter(type: 'egg' | 'pet' | 'potion') {
    const existingIndex = typeFilters.value.indexOf(type);

    if (existingIndex > -1) {
      typeFilters.value.splice(existingIndex, 1);
    } else {
      typeFilters.value.push(type);
    }
  }

  function deselectTypeFilter(type: 'egg' | 'pet' | 'potion') {
    const existingIndex = typeFilters.value.indexOf(type);

    if (existingIndex > -1) {
      typeFilters.value.splice(existingIndex, 1);
    }
  }

  function buildRequestParams(): FetchProductsRequest {
    const availableTypes: Array<'transport' | 'pet' | 'egg' | 'potion'> =
      typeFilters.value.length > 0
        ? [...typeFilters.value, 'transport']
        : ['transport', 'pet', 'egg', 'potion'];

    const typeFiltersList = availableTypes.map((type): ProductFilterType => {
      const filterConfig: ProductFilterType = { type };

      if (activeRarities.value.length > 0) {
        filterConfig.rarities = activeRarities.value;
      }

      if (activeLevels.value.length > 0) {
        filterConfig.levels = activeLevels.value;
      }

      if (backendPropertyFilter.value) {
        filterConfig.properties = backendPropertyFilter.value;
      }

      return filterConfig;
    });

    return {
      filter: {
        types: typeFiltersList,
      },
      page: activePage.value,
      amount: 72,
      currency: 'usd',
      sort: { [currentSortType.value]: 'desc' },
    };
  }

  function applyResponseData(response: FetchProductsResponse) {
    if (response.items) {
      updateItems(response.items);
    }

    if (response.totalPages) {
      updatePagesCount(response.totalPages);
    }

    if (response.total !== undefined) {
      updateItemsCount(response.total);
    }

    if (response.page) {
      updatePage(response.page);
    }
  }

  async function loadProducts() {
    updateLoadingState(true);
    updateError(null);

    try {
      const requestParams = buildRequestParams();
      const response = await productApi.fetchProducts(requestParams);

      if (response.items) {
        updateItems(response.items);
      }

      if (response.totalPages) {
        updatePagesCount(response.totalPages);
      }

      if (response.total !== undefined) {
        updateItemsCount(response.total);
      }

      if (response.page) {
        updatePage(response.page);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'При загрузке данных произошла ошибка';
      updateError(errorMessage);
      throw err;
    } finally {
      updateLoadingState(false);
    }
  }

  return {
    products: items,
    isLoading: loadingState,
    error: errorState,
    currentPage: activePage,
    totalPages: pagesCount,
    total: itemsCount,
    selectedRarityIndices: rarityFilterIndices,
    selectedProperties: propertyFilters,
    selectedSort: currentSortType,
    selectedTypes: typeFilters,
    toggleRarity: switchRarityFilter,
    clearRarities: resetRarityFilters,
    toggleProperty: switchPropertyFilter,
    clearProperties: resetPropertyFilters,
    setSort: changeSortType,
    toggleType: switchTypeFilter,
    removeType: deselectTypeFilter,
    getRequestParams: buildRequestParams,
    syncFromResponse: applyResponseData,
    setProducts: updateItems,
    addProducts: appendItems,
    clearProducts: resetItems,
    setPage: updatePage,
    setTotalPages: updatePagesCount,
    setTotal: updateItemsCount,
    setError: updateError,
    setLoading: updateLoadingState,
    fetchProducts: loadProducts,
  };
});
