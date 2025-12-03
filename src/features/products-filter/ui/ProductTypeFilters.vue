<template>
  <div class="product-type-filters">
    <div class="product-type-filters__dropdown-wrapper">
      <UIActionButton
        :appearance="ButtonAppearance.white"
        class="product-type-filters__category-button"
        @click="toggleCategoryDropdown"
      >
        <p class="product-type-filters__category-text">Транспорт</p>
        <UISvgIcon
          name="arrowRight"
          :class="categoryArrowClasses"
          class="product-type-filters__category-arrow"
        />
      </UIActionButton>

      <div v-show="isCategoryDropdownVisible" class="product-type-filters__dropdown">
        <UIActionButton
          v-for="categoryOption in categoryOptions"
          :key="categoryOption.value"
          :appearance="ButtonAppearance.secondary"
          ghost
          class="product-type-filters__dropdown-item"
          @click="handleCategorySelect(categoryOption.value)"
        >
          <p class="product-type-filters__dropdown-text">{{ categoryOption.label }}</p>
        </UIActionButton>
      </div>
    </div>

    <UIActionButton
      v-for="typeOption in typeOptions"
      :key="typeOption.value"
      :appearance="ButtonAppearance.white"
      :class="getTypeButtonClasses(typeOption.value)"
      class="product-type-filters__type-button"
      @click="toggleProductType(typeOption.value)"
    >
      <p class="product-type-filters__type-text">{{ typeOption.label }}</p>
    </UIActionButton>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ButtonAppearance } from '~/shared/types';

const productsStore = useProductsStore();
const { selectedTypes: activeProductTypes } = storeToRefs(productsStore);
const { toggleType: toggleProductType } = productsStore;

const isCategoryDropdownVisible = ref(false);

type ProductType = 'egg' | 'pet' | 'potion';

interface ProductTypeOption {
  value: ProductType;
  label: string;
}

const categoryOptions: ProductTypeOption[] = [
  { value: 'egg', label: 'Яйцо' },
  { value: 'pet', label: 'Питомец' },
  { value: 'potion', label: 'Зелье' },
];

const typeOptions: ProductTypeOption[] = [
  { value: 'egg', label: 'Яйцо' },
  { value: 'pet', label: 'Питомец' },
  { value: 'potion', label: 'Зелье' },
];

function toggleCategoryDropdown() {
  isCategoryDropdownVisible.value = !isCategoryDropdownVisible.value;
}

function handleCategorySelect(categoryValue: ProductType) {
  toggleProductType(categoryValue);
  isCategoryDropdownVisible.value = false;
}

const categoryArrowClasses = computed(() => ({
  'is-expanded': isCategoryDropdownVisible.value,
}));

function getTypeButtonClasses(typeValue: ProductType) {
  return {
    'is-active': activeProductTypes.value.includes(typeValue),
  };
}
</script>

<style lang="scss" scoped>
.product-type-filters {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 16px;
  margin: 20px 16px;
  box-sizing: border-box;

  &__dropdown-wrapper {
    position: relative;
  }

  &__category-button {
    display: flex;
    align-items: center;
    flex-direction: row;
    height: 100%;
    border-radius: 4px;
    background: var(--color-white);
    text-align: left;
    padding: 8px 14px;

    &:hover {
      background: var(--color-grey-bg);
    }
  }

  &__category-text {
    font-weight: 500;
  }

  &__category-arrow {
    margin-left: 6px;
    width: 18px;
    height: 18px;
    transition: transform 0.2s ease-in-out;
    transform: rotate(90deg);

    &.is-expanded {
      transform: rotate(270deg);
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
  }

  &__dropdown-item {
    display: flex;
    align-items: center;
    flex-direction: row;
    height: 100%;
    width: 100%;
    border-radius: 4px;
    background: var(--color-white);
    text-align: left;
    padding: 8px 14px;

    &:hover {
      background: var(--color-grey-bg);
    }
  }

  &__dropdown-text {
    font-weight: 500;
  }

  &__type-button {
    display: flex;
    align-items: center;
    flex-direction: row;
    height: 100%;
    border-radius: 4px;
    background: var(--color-white);
    text-align: left;
    padding: 8px 14px;

    &:hover {
      background: var(--color-grey-bg);
    }

    &.is-active {
      background: var(--color-grey-bg);
    }
  }

  &__type-text {
    font-weight: 500;
  }
}
</style>

