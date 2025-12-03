<template>
  <div class="last-purchase-card" :style="cardStyles">
    <UIProductImage :image="purchaseItem.imageUri" class="last-purchase-card__image" />
    <div class="last-purchase-card__info">
      <div class="last-purchase-card__cost">
        {{ displayCost }}
      </div>
      <div class="last-purchase-card__title">
        {{ purchaseItem.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '~/shared/types/product';

import commonBackground from '~/shared/assets/images/latestPurchases/common.png';
import uncommonBackground from '~/shared/assets/images/latestPurchases/uncommon.png';
import rareBackground from '~/shared/assets/images/latestPurchases/rare.png';
import ultraRareBackground from '~/shared/assets/images/latestPurchases/ultraRare.png';
import legendaryBackground from '~/shared/assets/images/latestPurchases/legendary.png';

interface LastPurchaseCardProps {
  product: Product;
}

const props = defineProps<LastPurchaseCardProps>();

const purchaseItem = computed(() => props.product);

function getItemRarityValue() {
  const item = purchaseItem.value;

  if (item.rare) {
    return item.rare;
  }
  if (item.rarity) {
    return item.rarity;
  }

  return 'common';
}

const itemRarity = computed(() => getItemRarityValue());

const rarityBackgroundMap = {
  common: commonBackground,
  uncommon: uncommonBackground,
  rare: rareBackground,
  ultra_rare: ultraRareBackground,
  legendary: legendaryBackground,
};

function getBackgroundByRarity(rarityValue: string) {
  return rarityBackgroundMap[rarityValue as keyof typeof rarityBackgroundMap] || commonBackground;
}

const cardBackgroundUrl = computed(() => {
  return getBackgroundByRarity(itemRarity.value);
});

function formatPurchasePrice(amount: number) {
  const formattedValue = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${formattedValue} $`;
}

const displayCost = computed(() => {
  const itemPrice = purchaseItem.value.price || 0;

  return formatPurchasePrice(itemPrice);
});

const cardStyles = computed(() => ({
  backgroundImage: `url(${cardBackgroundUrl.value})`,
}));
</script>

<style lang="scss" scoped>
.last-purchase-card {
  position: relative;
  width: 160px;
  height: 125px;
  padding: 24px 20px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;

  &__image {
    position: absolute;
    top: 10px;
    right: 2px;
    width: 78px;
    height: 78px;
  }

  &__info {
    position: absolute;
    bottom: 10px;
    left: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
  }

  &__cost {
    color: var(--color-text-black);
    margin-bottom: 6px;
    font-size: 18px;
    font-weight: 700;
  }

  &__title {
    color: var(--color-grey-medium);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
    font-size: 14px;
    font-weight: 500;
  }
}
</style>

