<template>
  <div class="market-product-card" :class="cardRarityClass">
    <UIProductImage :image="itemData.imageUri" class="market-product-card__image" />

    <div class="market-product-card__content">
      <p class="market-product-card__type">
        {{ displayType }}
      </p>
      <p class="market-product-card__title">
        {{ itemData.name }}
      </p>
      <p class="market-product-card__price">
        {{ displayPrice }}
      </p>
    </div>

    <div class="market-product-card__badges-wrapper">
      <div class="market-product-card__badges">
        <UIProductPropertyBadge v-if="itemData.level === 'neon'" type="neon" />
        <UIProductPropertyBadge v-if="itemData.level === 'mega_neon'" type="mega" />
        <UIProductPropertyBadge v-if="itemData.flyable" type="fly" />
        <UIProductPropertyBadge v-if="itemData.rideable" type="raid" />
      </div>
    </div>

    <div class="market-product-card__action">
      <UIActionButton
        :appearance="ButtonAppearance.primary"
        without-padding
        class="market-product-card__add-button"
        @click.stop="onAddToCartClick"
      >
        <UISvgIcon name="cartPlus" class="market-product-card__add-icon" />
      </UIActionButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '~/shared/types/product';
import { ButtonAppearance } from '~/shared/types';

interface MarketProductCardProps {
  product: Product;
}

const props = defineProps<MarketProductCardProps>();

const emit = defineEmits<{
  addToCart: [product: Product];
}>();

const itemData = computed(() => props.product);

const displayType = computed(() => {
  const productType = itemData.value.type || '';

  if (!productType) return '';

  return productType.charAt(0).toUpperCase() + productType.slice(1);
});

const displayPrice = computed(() => {
  const productPrice = itemData.value.price || 0;

  return `${productPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $`;
});

const cardRarityClass = computed(() => {
  const rarity = itemData.value.rare || 'common';
  return `market-product-card--${rarity}`;
});

function onAddToCartClick() {
  emit('addToCart', itemData.value);
}
</script>

<style lang="scss" scoped>
.market-product-card {
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 170px;
  padding: 16px;
  border-radius: 8px;
  background: var(--color-white);
  border: 2px solid var(--color-grey-bg);
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--box-shadow);

    .market-product-card__action {
      opacity: 1;
    }
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    height: 3px;
    width: 40px;
    background: var(--color-blue-primary);
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }

  &--common {
    &::after {
      background: var(--color-blue-primary);
    }
  }

  &--uncommon {
    &::after {
      background: var(--color-purple-primary);
    }
  }

  &--rare {
    &::after {
      background: var(--color-green-rare);
    }
  }

  &--ultra_rare {
    &::after {
      background: var(--color-red-primary);
    }
  }

  &--legendary {
    &::after {
      background: var(--color-grey-dark);
    }
  }

  &__image {
    width: 78px;
    height: 78px;
    flex-shrink: 0;
    margin-bottom: 10px;
  }

  &__content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 4px;
    margin-top: 4px;
    color: var(--color-grey-medium);
    text-align: left;
  }

  &__type {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 400;
  }

  &__title {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text-black);
  }

  &__price {
    font-size: 16px;
    font-weight: 700;
    color: var(--color-text-black);
  }

  &__badges {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;

    &-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
  }

  &__action {
    position: absolute;
    bottom: 10px;
    right: 10px;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;

    button {
      border-bottom: none;
      box-shadow: none;
      
      &::after,
      &::before {
        display: none;
      }
    }
  }

  &__add-button {
    width: 28px;
    height: 28px;
  }

  &__add-icon {
    width: 18px;
    height: 18px;
  }
}
</style>

