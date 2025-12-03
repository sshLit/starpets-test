<template>
  <div
    v-show="shouldShowDropdown"
    class="search-history-dropdown"
  >
    <div class="search-history-dropdown__header">
      <p class="search-history-dropdown__title">История запросов</p>
      <button class="search-history-dropdown__clear" @click="clearHistory">
        <p>Удалить все</p>
      </button>
    </div>
    <div class="search-history-dropdown__list">
      <div
        v-for="(item, index) in searchHistoryItems"
        :key="index"
        class="search-history-dropdown__item"
        @mousedown.prevent="emit('select', item)"
      >
        <p>{{ item }}</p>
        <button
          class="search-history-dropdown__item-delete"
          @mousedown.stop.prevent="removeFromHistory(index)"
        >
          <UISvgIcon name="close" class="search-history-dropdown__item-icon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSearchHistoryStore } from '../model/searchHistoryStore';

interface SearchHistoryDropdownProps {
  isVisible?: boolean;
}

const props = defineProps<SearchHistoryDropdownProps>();

const emit = defineEmits<{
  select: [value: string];
}>();

const searchHistoryStore = useSearchHistoryStore();
const { searchHistory: searchHistoryItems } = storeToRefs(searchHistoryStore);
const { removeFromHistory, clearHistory } = searchHistoryStore;

const shouldShowDropdown = computed(() => {
  return props.isVisible && searchHistoryItems.value.length > 0;
});
</script>

<style lang="scss" scoped>
.search-history-dropdown {
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  right: 0;
  max-height: 400px;
  padding: 12px;
  background: var(--color-white);
  border-radius: 8px;
  box-shadow: var(--box-shadow-dropdown);
  z-index: 100;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--color-grey-bg);
  }

  &__title {
    margin: 0;
    color: var(--color-grey-medium);
    font-size: 16px;
    font-weight: 500;
  }

  &__clear {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    color: var(--color-grey-medium);
    font-size: 14px;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: var(--color-black);
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.15s ease-in-out;

    &:hover {
      background: var(--color-grey-bg);
    }

    p {
      margin: 0;
      color: var(--color-black);
      font-size: 14px;
      flex: 1;
    }
  }

  &__item-delete {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-grey-medium);
    transition: color 0.15s ease-in-out;
    margin-left: 8px;

    &:hover {
      color: var(--color-black);
    }
  }

  &__item-icon {
    width: 12px;
    height: 12px;
  }
}
</style>

