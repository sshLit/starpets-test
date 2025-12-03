<template>
  <div v-if="hasActiveFilters" class="active-product-type-chips">
    <UIActionButton
      v-for="filter in activeFiltersList"
      :key="filter.value"
      :appearance="ButtonAppearance.white"
      class="active-product-type-chips__item"
    >
      <p class="active-product-type-chips__label">{{ filter.label }}</p>
      <UISvgIcon
        name="close"
        class="active-product-type-chips__remove-icon"
        @click.stop="onFilterRemove(filter.value)"
      />
    </UIActionButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ButtonAppearance } from '~/shared/types';

const productsStore = useProductsStore();

const productTypeLabels: Record<'egg' | 'pet' | 'potion', string> = {
  egg: 'Яйцо',
  pet: 'Питомец',
  potion: 'Зелье',
};

const activeFiltersList = computed(() => {
  return productsStore.selectedTypes.map((type) => ({
    value: type,
    label: productTypeLabels[type],
  }));
});

const hasActiveFilters = computed(() => {
  return productsStore.selectedTypes.length > 0;
});

function onFilterRemove(type: 'egg' | 'pet' | 'potion') {
  productsStore.removeType(type);
}
</script>

<style lang="scss" scoped>
.active-product-type-chips {
  display: inline-flex;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 1023px) {
    display: none;
  }

  &__item {
    display: flex;
    align-items: center;
    flex-direction: row;
    height: 100%;
    border-radius: 4px;
    background: var(--color-white);
    text-align: left;
    padding: 8px 14px;
    transition: background 0.2s ease-in-out;

    &:hover {
      background: var(--color-grey-bg);
    }
  }

  &__label {
    margin: 0;
    font-weight: 500;
  }

  &__remove-icon {
    width: 12px;
    height: 12px;
    margin-left: 8px;
    cursor: pointer;
    transition: opacity 0.2s ease-in-out;

    &:hover {
      opacity: 0.7;
    }
  }
}
</style>

