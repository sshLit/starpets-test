<template>
  <aside class="product-filters-panel">
    <div class="product-filters-panel__header">
      <p class="product-filters-panel__header-title">Фильтры</p>
      <div class="product-filters-panel__header-actions">
        <UIActionButton :appearance="ButtonAppearance.secondary" ghost without-padding @click="handleResetFilters">
          <p class="product-filters-panel__header-reset-text">Сбросить</p>
        </UIActionButton>
        <UIActionButton
          :appearance="ButtonAppearance.secondary"
          ghost
          without-padding
          class="product-filters-panel__header-close-button"
          @click="handleClose"
        >
          <UISvgIcon name="close" class="product-filters-panel__header-close-icon" />
        </UIActionButton>
      </div>
    </div>

    <div class="product-filters-panel__content">
      <div class="product-filters-panel__section">
        <div class="product-filters-panel__section-header">
          <p class="product-filters-panel__section-title">Цена</p>
        </div>
        <div class="product-filters-panel__section-price-range">
          <div class="product-filters-panel__section-price-input">
            <span class="product-filters-panel__section-price-currency">$</span>
            <input
              v-model="minPriceValue"
              type="number"
              placeholder="0.00"
              class="product-filters-panel__section-price-field"
            />
          </div>
          <span class="product-filters-panel__section-price-separator">—</span>
          <div class="product-filters-panel__section-price-input">
            <span class="product-filters-panel__section-price-currency">$</span>
            <input v-model="maxPriceValue" type="number" placeholder="∞" class="product-filters-panel__section-price-field" />
          </div>
        </div>
      </div>

      <div class="product-filters-panel__section product-filters-panel__section--mobile-only">
        <div class="product-filters-panel__section-header" @click="toggleSection('productType')">
          <p class="product-filters-panel__section-title">Тип предмета</p>
          <UISvgIcon
            name="arrowRight"
            :class="productTypeArrowClasses"
            class="product-filters-panel__section-arrow"
          />
        </div>
        <div v-show="isProductTypeSectionExpanded" class="product-filters-panel__section-content">
          <ProductTypeFilters />
        </div>
      </div>

      <div class="product-filters-panel__section">
        <div class="product-filters-panel__section-header" @click="toggleSection('rarity')">
          <p class="product-filters-panel__section-title">Редкость</p>
          <UISvgIcon
            name="arrowRight"
            :class="rarityArrowClasses"
            class="product-filters-panel__section-arrow"
          />
        </div>
        <div v-show="isRaritySectionExpanded" class="product-filters-panel__section-content">
          <div class="product-filters-panel__section-rarity-swatches">
            <div
              v-for="(rarityOption, index) in rarityOptions"
              :key="index"
              class="product-filters-panel__section-rarity-swatch"
              :class="getRaritySwatchClasses(rarityOption, index)"
              @click="toggleRarity(index)"
            />
          </div>
        </div>
      </div>

      <div class="product-filters-panel__section">
        <div class="product-filters-panel__section-header" @click="toggleSection('properties')">
          <p class="product-filters-panel__section-title">Свойства</p>
          <UISvgIcon
            name="arrowRight"
            :class="propertiesArrowClasses"
            class="product-filters-panel__section-arrow"
          />
        </div>
        <div v-show="isPropertiesSectionExpanded" class="product-filters-panel__section-content">
          <div class="product-filters-panel__section-properties">
            <div
              v-for="propertyOption in propertyOptions"
              :key="propertyOption.type"
              class="product-filters-panel__section-property-item"
              :class="getPropertyItemClasses(propertyOption.type)"
              @click="toggleProperty(propertyOption.type)"
            >
              <div
                class="product-filters-panel__section-property-checkbox"
                :class="getPropertyCheckboxClasses(propertyOption.type)"
              />
              <UIProductPropertyBadge :type="propertyOption.type" />
              <p class="product-filters-panel__section-property-label">{{ propertyOption.label }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="product-filters-panel__footer">
      <p class="product-filters-panel__footer-text">© 2020-2023 STARPETS.GG All Rights Reserved</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ButtonAppearance } from '~/shared/types';
import ProductTypeFilters from './ProductTypeFilters.vue';

defineProps<{
  isOpen?: boolean;
}>();

const emit = defineEmits<{
  'update:isOpen': [value: boolean];
  close: [];
}>();

const productsStore = useProductsStore();
const {
  selectedRarityIndices: activeRarityIndices,
  toggleRarity,
  clearRarities,
  selectedProperties: activePropertyTypes,
  toggleProperty,
  clearProperties,
} = productsStore;

const expandedSections = ref({
  productType: true,
  rarity: true,
  properties: true,
});

const minPriceValue = ref('0.00');
const maxPriceValue = ref('');

const rarityOptions = [
  { color: 'common' },
  { color: 'uncommon' },
  { color: 'rare' },
  { color: 'ultra_rare' },
  { color: 'legendary' },
];

const propertyOptions: Array<{ type: 'regular' | 'neon' | 'mega' | 'fly' | 'raid'; label: string }> = [
  { type: 'regular', label: 'Обычный' },
  { type: 'neon', label: 'Неон' },
  { type: 'mega', label: 'Мега-неон' },
  { type: 'fly', label: 'Флай' },
  { type: 'raid', label: 'Райд' },
];

function toggleSection(section: 'productType' | 'rarity' | 'properties') {
  expandedSections.value[section] = !expandedSections.value[section];
}

function handleResetFilters() {
  minPriceValue.value = '0.00';
  maxPriceValue.value = '';
  clearRarities();
  clearProperties();
}

function handleClose() {
  emit('update:isOpen', false);
  emit('close');
}

const isProductTypeSectionExpanded = computed(() => expandedSections.value.productType);
const isRaritySectionExpanded = computed(() => expandedSections.value.rarity);
const isPropertiesSectionExpanded = computed(() => expandedSections.value.properties);

const productTypeArrowClasses = computed(() => ({
  'product-filters-panel__section-arrow--expanded': expandedSections.value.productType,
}));

const rarityArrowClasses = computed(() => ({
  'product-filters-panel__section-arrow--expanded': expandedSections.value.rarity,
}));

const propertiesArrowClasses = computed(() => ({
  'product-filters-panel__section-arrow--expanded': expandedSections.value.properties,
}));

function getRaritySwatchClasses(rarityOption: { color: string }, index: number) {
  return [
    {
      'product-filters-panel__section-rarity-swatch--active': activeRarityIndices.includes(index),
    },
    `product-filters-panel__section-rarity-swatch--${rarityOption.color}`,
  ];
}

function getPropertyItemClasses(propertyType: string) {
  return {
    'product-filters-panel__section-property-item--active': activePropertyTypes.includes(propertyType),
  };
}

function getPropertyCheckboxClasses(propertyType: string) {
  return {
    'product-filters-panel__section-property-checkbox--active': activePropertyTypes.includes(propertyType),
  };
}
</script>

<style lang="scss" scoped>
.product-filters-panel {
  background: var(--color-white);
  display: flex;
  flex-direction: column;
  overflow: auto;
  z-index: 101;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;

  &__header {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--color-grey-bg);
    background: var(--color-white-05);
    backdrop-filter: blur(5px);

    &-title {
      font-size: 18px;
      font-weight: 500;
    }

    &-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    &-reset-text {
      font-size: 14px;
    }

    &-close-button {
      @media (min-width: 1440px) {
        display: none;
      }
    }

    &-close-icon {
      width: 18px;
      height: 18px;
    }
  }

  &__content {
    padding: 24px;
  }

  &__section {
    margin-bottom: 32px;

    &:last-child {
      margin-bottom: 0;
    }

    &--mobile-only {
      @media (min-width: 744px) {
        display: none !important;
      }
    }

    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      margin-bottom: 16px;
    }

    &-title {
      font-size: 16px;
      font-weight: 500;
      color: var(--color-grey-lightest);
    }

    &-content {
      margin-top: 16px;

      & > :deep(.product-type-filters) {
        margin: 0;
        flex-wrap: wrap;
      }
    }

    &-arrow {
      width: 18px;
      height: 18px;
      transition: transform 0.2s ease;
      transform: rotate(90deg);
      color: var(--color-grey-medium);

      &--expanded {
        transform: rotate(-90deg);
      }
    }

    &-price-range {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    &-price-input {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: var(--color-white);
      border: 1px solid var(--color-grey-bg);
      border-radius: 8px;
    }

    &-price-field {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: 16px;
      font-weight: 500;
      color: var(--color-text-black);
      max-width: 80px;

      &::placeholder {
        color: var(--color-grey-medium);
        opacity: 1;
      }
    }

    &-price-currency {
      color: var(--color-grey-medium);
      font-weight: 500;
    }

    &-price-separator {
      color: var(--color-grey-lightest);
      font-weight: 500;
    }

    &-rarity-swatches {
      display: flex;
      gap: 14px;
    }

    &-rarity-swatch {
      width: 40px;
      height: 40px;
      aspect-ratio: 1;
      border-radius: 8px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;

      &::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: translate(-50%, -60%) rotate(45deg);
        opacity: 0;
        transition: opacity 0.2s ease;
        z-index: 1;
      }

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 6px;
        transform: translateY(26px);
        transition: transform 0.3s ease-in-out;
      }

      &:hover {
        &::after {
          transform: translateY(6px);
        }
      }

      &--active {
        &::after {
          transform: translateY(0);
        }

        &::before {
          opacity: 1;
        }
      }

      &--common {
        background: var(--color-blue-primary-4d);
        &::after {
          background: var(--color-blue-primary);
        }
      }

      &--uncommon {
        background: var(--color-purple-primary-4d);
        &::after {
          background: var(--color-purple-primary);
        }
      }

      &--rare {
        background: var(--color-green-rare-light);
        &::after {
          background: var(--color-green-rare);
        }
      }

      &--ultra_rare {
        background: var(--color-pink-ultra-rare);
        &::after {
          background: var(--color-red-primary);
        }
      }

      &--legendary {
        background: var(--color-grey-lightest);
        &::after {
          background: var(--color-grey-dark);
        }
      }
    }

    &-properties {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    &-property-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s ease;

      &:hover {
        background: var(--color-grey-bg-light);
      }

      &--active {
        background: var(--color-grey-bg);
      }
    }

    &-property-checkbox {
      width: 20px;
      height: 20px;
      border: 2px solid var(--color-grey-lightest);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.2s ease;
      position: relative;

      &--active {
        background: var(--button-primary-solid-background-default);
        border-color: var(--button-primary-solid-background-default);

        &::after {
          content: '';
          position: absolute;
          left: 5px;
          top: 1px;
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
      }
    }

    &-property-label {
      font-size: 14px;
    }
  }

  &__footer {
    padding: 20px 24px;
    text-align: center;

    &-text {
      font-size: 12px;
      color: var(--color-grey-lightest);
    }
  }
}
</style>

