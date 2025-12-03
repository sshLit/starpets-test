<template>
  <div class="recent-purchases-widget">
    <div class="recent-purchases-widget__activity">
      <MarketActivityCard
        :is-expanded="isExpandedLayout"
        :total-transactions="totalTransactionsCount"
        :active-users="3415"
      />
    </div>
    <div class="recent-purchases-widget__list">
      <div class="recent-purchases-widget__scroll">
        <LastPurchaseCard v-for="purchaseItem in recentPurchases" :key="purchaseItem.id" :product="purchaseItem" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { Product } from '~/shared/types/product';

const RECENT_PURCHASES_STORAGE_KEY = 'recent-purchases';
const recentPurchases = ref<Product[]>([]);
const screenWidth = ref(0);

const totalTransactionsCount = computed(() => recentPurchases.value.length + 4513613);
const isExpandedLayout = computed(() => screenWidth.value >= 1440);

function loadRecentPurchases() {
  if (import.meta.client) {
    try {
      const storedData = localStorage.getItem(RECENT_PURCHASES_STORAGE_KEY);

      if (storedData) {
        recentPurchases.value = JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Error loading recent purchases from localStorage:', error);
    }
  }
}

function handleStorageUpdate(event: StorageEvent) {
  if (event.key === RECENT_PURCHASES_STORAGE_KEY) {
    loadRecentPurchases();
  }
}

function handlePurchaseUpdate() {
  loadRecentPurchases();
}

function updateScreenWidth() {
  if (import.meta.client) {
    screenWidth.value = window.innerWidth;
  }
}

function initializeRecentPurchasesWidget() {
  loadRecentPurchases();
  updateScreenWidth();
}

onMounted(() => {
  initializeRecentPurchasesWidget();

  if (import.meta.client) {
    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('resize', updateScreenWidth);
    window.addEventListener('purchase-completed', handlePurchaseUpdate);
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('storage', handleStorageUpdate);
    window.removeEventListener('resize', updateScreenWidth);
    window.removeEventListener('purchase-completed', handlePurchaseUpdate);
  }
});
</script>

<style lang="scss" scoped>
.recent-purchases-widget {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 16px;
  padding: 4px;
  background: var(--color-white);
  border-radius: 8px;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;

  &__activity {
    flex: 0 0 auto;
  }

  &__list {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    gap: 8px;

    :deep(.last-purchase-card) {
      flex: 0 0 auto;
    }
  }

  &__scroll {
    display: flex;
    flex-direction: row;
    gap: 10px;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: var(--color-grey-bg) transparent;

    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--color-grey-bg);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: var(--color-grey-medium);
    }
  }
}
</style>

