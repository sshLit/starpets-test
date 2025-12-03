<template>
  <div class="cart-product-card" :class="cardRarityClass">
    <UIProductImage :image="cartItemImage" class="cart-product-card__image" />

    <div class="cart-product-card__details">
      <p class="cart-product-card__category">
        {{ displayCategory }}
      </p>
      <p class="cart-product-card__title">
        {{ cartItem.name }}
      </p>
      <p class="cart-product-card__cost">
        {{ displayCost }}
      </p>
    </div>

    <div v-show="shouldShowBadges" class="cart-product-card__badges-wrapper">
      <div class="cart-product-card__badges">
        <UIProductPropertyBadge v-if="cartItem.level === 'neon'" type="neon" />
        <UIProductPropertyBadge v-if="cartItem.level === 'mega_neon'" type="mega" />
        <UIProductPropertyBadge v-if="cartItem.flyable" type="fly" />
        <UIProductPropertyBadge v-if="cartItem.rideable" type="raid" />
      </div>
    </div>

    <UIActionButton
      :appearance="ButtonAppearance.secondary"
      without-padding
      class="cart-product-card__remove"
      @click="onRemoveClick"
    >
      <UISvgIcon name="close" class="cart-product-card__remove-icon" />
    </UIActionButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import avaImage from '~/shared/assets/images/avatar.jpg';
import type { Product } from '~/shared/types/product';
import { ButtonAppearance } from '~/shared/types';

interface CartProductCardProps {
  product: Product;
}

const props = defineProps<CartProductCardProps>();

const emit = defineEmits<{
  remove: [productId: string];
}>();

const cartItem = computed(() => props.product);

const cartItemImage = computed(() => {
  return cartItem.value.imageUri || cartItem.value.image || avaImage;
});

const productRarity = computed(() => {
  return (cartItem.value as any).rare || cartItem.value.rarity || 'common';
});

const displayCategory = computed(() => {
  const categoryType = cartItem.value.type || '';

  if (!categoryType) return '';

  return categoryType.charAt(0).toUpperCase() + categoryType.slice(1);
});

const displayCost = computed(() => {
  const itemPrice = cartItem.value.price || 0;

  return `${itemPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $`;
});

const hasSpecialProperties = computed(() => {
  return (
    cartItem.value.level === 'neon' ||
    cartItem.value.level === 'mega_neon' ||
    cartItem.value.flyable ||
    cartItem.value.rideable
  );
});

const shouldShowBadges = computed(() => hasSpecialProperties.value);

const cardRarityClass = computed(() => {
  const rarity = productRarity.value;
  return `cart-product-card--${rarity}`;
});

function onRemoveClick() {
  emit('remove', cartItem.value.id);
}
</script>

<style lang="scss" scoped>
.cart-product-card {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  background: var(--color-white);
  gap: 14px;
  border: 2px solid var(--color-grey-bg);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    margin: auto 0;
    height: 40px;
    width: 3px;
    background: var(--color-blue-primary);
    border-top-right-radius: 3px;
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
    width: 58px;
    height: 58px;
    flex-shrink: 0;
  }

  &__details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 4px;
    color: var(--color-grey-medium);
    margin: auto auto auto 0;
    flex: 1;
    min-width: 0;
  }

  &__category {
    font-size: 14px;
    font-weight: 400;
    color: var(--color-grey-medium);
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text-black);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }

  &__cost {
    font-size: 16px;
    font-weight: 700;
    color: var(--color-text-black);
  }

  &__badges {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    background: var(--color-grey-bg);
    padding: 10px;
    border-radius: 8px;

    &-wrapper {
      display: flex;
      align-items: flex-start;
      margin: auto 0 auto auto;
      width: 126px;
      flex-shrink: 0;
    }
  }

  &__remove {
    width: 28px;
    height: 28px;
    margin-right: 8px;
    flex-shrink: 0;
  }

  &__remove-icon {
    width: 12px;
    height: 12px;
  }
}
</style>

