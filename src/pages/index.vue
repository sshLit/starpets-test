<template>
  <div class="market-page">
    <RecentPurchasesWidget />

    <ProductTypeFilters />

    <div class="market-page__filters">
      <UIActionButton
        :appearance="ButtonAppearance.white"
        without-padding
        class="market-page__filters-button"
        @click="openAsidePanel"
      >
        <UISvgIcon name="filters" class="market-page__filters-icon" />
      </UIActionButton>

      <div class="market-page__search">
        <div class="market-page__search-wrapper">
          <UISearchField
            v-model="searchQueryText"
            placeholder="Быстрый поиск"
            @focus="isSearchHistoryDropdownVisible = true"
            @blur="handleSearchInputBlur"
            @keydown.enter="handleSearchInputEnter"
          />
          <SearchHistoryDropdown
            :is-visible="isSearchHistoryDropdownVisible"
            @select="selectSearchHistoryItem"
          />
        </div>
      </div>

      <div class="market-page__filter-button">
        <UIActionButton :appearance="ButtonAppearance.white" @click="isSortDropdownVisible = !isSortDropdownVisible">
          <UIColorBadge :color="sortConfiguration.badgeColor" class="market-page__sort-badge">
            <UISvgIcon :name="sortConfiguration.icon" class="market-page__sort-badge-icon" />
          </UIColorBadge>
          <p class="market-page__sort-label">{{ sortConfiguration.label }}</p>
          <UISvgIcon
            name="arrowRight"
            :class="sortArrowClasses"
            class="market-page__arrow"
          />
        </UIActionButton>

        <div v-show="isSortDropdownVisible" class="market-page__dropdown">
          <UIActionButton
            :appearance="ButtonAppearance.secondary"
            wide
            ghost
            :disabled="isPopularitySortDisabled"
            @click="handleSortOptionChange('popularity')"
          >
            <div class="market-page__button-content">
              <UIColorBadge color="blue" class="market-page__dropdown-badge">
                <UISvgIcon name="star" class="market-page__dropdown-badge-icon" />
              </UIColorBadge>
              <p class="market-page__dropdown-label">Популярность</p>
            </div>
          </UIActionButton>
        </div>
      </div>
      <ActiveProductTypeChips />
    </div>

    <div class="market-page__list">
      <UIActionButton
        v-for="product in productsList"
        :key="product.id"
        ghost
        without-padding
        @click="handleProductCardClick(product)"
      >
        <MarketProductCard :product="product" />
      </UIActionButton>
      <div v-if="isProductsLoading" class="market-page__loading">
        <p>Загрузка...</p>
      </div>
      <div v-if="productsError" class="market-page__error">
        <p>{{ productsError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import type { Product } from '~/shared/types/product';
import { ButtonAppearance } from '~/shared/types';
import { useProductQuery } from '~/entities/product/api/useProducts';
import { useCartStore } from '~/features/add-to-cart/model/cartStore';
import { useSearchHistoryStore } from '~/features/search-history/model/searchHistoryStore';
import { useUiStore } from '~/app/model/uiStore';
import ProductTypeFilters from '~/features/products-filter/ui/ProductTypeFilters.vue';
import ActiveProductTypeChips from '~/features/products-filter/ui/ActiveProductTypeChips.vue';
import SearchHistoryDropdown from '~/features/search-history/ui/SearchHistoryDropdown.vue';

const isSortDropdownVisible = ref(false);
const searchQueryText = ref('');
const isSearchHistoryDropdownVisible = ref(false);

const uiStore = useUiStore();
const cartStore = useCartStore();
const productsStore = useProductsStore();
const searchHistoryStore = useSearchHistoryStore();

const { openAside: openAsidePanel } = uiStore;
const { addToCart } = cartStore;
const { products: productsList } = storeToRefs(productsStore);
const { loadSearchHistory, addToHistory } = searchHistoryStore;

const requestParams = computed(() => productsStore.getRequestParams());

const productsQuery = useProductQuery(requestParams, (response) => {
  productsStore.syncFromResponse(response);
});

const isProductsLoading = computed(() => productsQuery.isLoading.value);
const productsError = computed(() => productsQuery.error.value?.message);

const sortConfiguration = computed(() => {
  if (productsStore.selectedSort === 'popularity') {
    return {
      label: 'Популярность',
      icon: 'star',
      badgeColor: 'blue' as const,
    };
  }
});

const sortArrowClasses = computed(() => ({
  'market-page__arrow--active': isSortDropdownVisible.value,
}));

const isPopularitySortDisabled = computed(() => productsStore.selectedSort === 'popularity');

function selectSearchHistoryItem(item: string) {
  searchQueryText.value = item;
  isSearchHistoryDropdownVisible.value = false;
}

function handleSearchInputBlur() {
  if (searchQueryText.value.trim()) {
    addToHistory(searchQueryText.value);
  }

  nextTick(() => {
    setTimeout(() => {
      isSearchHistoryDropdownVisible.value = false;
    }, 200);
  });
}

function handleSearchInputEnter() {
  if (searchQueryText.value.trim()) {
    addToHistory(searchQueryText.value);
    isSearchHistoryDropdownVisible.value = false;
  }
}

function handleSortOptionChange(sort: 'popularity' | 'price') {
  productsStore.setSort(sort);
  isSortDropdownVisible.value = false;
}

function handleProductCardClick(product: Product) {
  addToCart(product);
}

function initializeMarketPage() {
  loadSearchHistory();
}

onMounted(initializeMarketPage);
</script>

<style lang="scss">
.market-page {
  width: 100%;
  overflow-x: hidden;
  max-width: 100%;
  box-sizing: border-box;

  &__filters {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 16px;
    margin: 20px 16px;
    flex-wrap: wrap;
    box-sizing: border-box;
  }

  &__filters-button {
    width: 46px;
    height: 46px;
    flex: 0 0 auto;

    @media (min-width: 1440px) {
      display: none;
    }
  }

  &__filters-icon {
    width: 24px;
    height: 24px;
  }

  &__search {
    flex: 1;
    min-width: 0;
    max-width: 300px;
    position: relative;
  }

  &__search-wrapper {
    position: relative;
    width: 100%;
  }

  &__filter-button {
    position: relative;
    flex: 0 0 auto;
    display: flex;
    align-items: center;

    :deep(.action-button) {
      height: 40px;
      display: flex;
      align-items: center;
    }
  }

  &__sort-badge {
    width: 32px;
    height: 32px;
    margin-left: 14px;
    margin-right: 8px;
  }

  &__sort-badge-icon {
    width: 24px;
    height: 24px;
  }

  &__sort-label {
    margin: 0;
    font-weight: 500;
  }

  &__arrow {
    width: 18px;
    height: 18px;
    margin-left: 6px;
    transition: transform 0.2s ease-in-out;
    transform: rotate(90deg);

    &--active {
      transform: rotate(270deg);
    }
  }

  &__button-content {
    display: flex;
    align-items: center;
    flex-direction: row;
    height: 48px;
    border-radius: 4px;
    background: var(--color-white);
    text-align: left;
    padding: 8px 14px;

    &:hover {
      background: var(--color-grey-bg);
    }
  }

  &__dropdown {
    position: absolute;
    top: calc(100% + 2px);
    left: 0;
    max-height: 570px;
    padding: 4px;
    background: var(--color-white);
    border-radius: 8px;
    box-shadow: var(--box-shadow-dropdown);
    z-index: 100;

    & > * {
      width: 100%;
    }
  }

  &__dropdown-badge {
    width: 32px;
    height: 32px;
    margin-top: 4px;
    margin-left: 8px;
    margin-bottom: 4px;
    margin-right: 8px;
  }

  &__dropdown-badge-icon {
    width: 24px;
    height: 24px;
  }

  &__dropdown-label {
    margin: 0;
    font-weight: 500;
  }

  &__list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 10px;
    margin: 16px;
    box-sizing: border-box;

    :deep(.action-button) {
      text-decoration: none;
      outline: none;
      
      &:hover,
      &:focus,
      &:active {
        text-decoration: none;
        outline: none;
      }
    }
  }

  &__loading {
    width: 100%;
    padding: 20px;
    text-align: center;
    color: var(--color-grey-medium);
  }

  &__error {
    width: 100%;
    padding: 20px;
    text-align: center;
    color: var(--color-red-error);
  }
}
</style>

