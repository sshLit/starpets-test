const SEARCH_HISTORY_STORAGE_KEY = 'search-history';
const MAX_SEARCH_HISTORY_ITEMS = 10;

export const useSearchHistoryStore = defineStore('searchHistoryStore', () => {
  const searchHistoryItems = ref<string[]>([]);

  function loadSearchHistoryFromStorage() {
    if (import.meta.client) {
      try {
        const storedHistory = localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY);

        if (storedHistory) {
          searchHistoryItems.value = JSON.parse(storedHistory);
        }
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    }
  }

  function saveSearchHistoryToStorage() {
    if (import.meta.client) {
      try {
        localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(searchHistoryItems.value));
      } catch (error) {
        console.error('Error saving search history:', error);
      }
    }
  }

  function addSearchQueryToHistory(query: string) {
    if (!query || !query.trim()) return;

    const trimmedQuery = query.trim();

    searchHistoryItems.value = searchHistoryItems.value.filter((item) => item !== trimmedQuery);
    searchHistoryItems.value.unshift(trimmedQuery);

    if (searchHistoryItems.value.length > MAX_SEARCH_HISTORY_ITEMS) {
      searchHistoryItems.value = searchHistoryItems.value.slice(0, MAX_SEARCH_HISTORY_ITEMS);
    }

    saveSearchHistoryToStorage();
  }

  function removeSearchHistoryItem(index: number) {
    searchHistoryItems.value.splice(index, 1);
    saveSearchHistoryToStorage();
  }

  function clearSearchHistory() {
    searchHistoryItems.value = [];
    saveSearchHistoryToStorage();
  }

  return {
    searchHistory: searchHistoryItems,
    loadSearchHistory: loadSearchHistoryFromStorage,
    addToHistory: addSearchQueryToHistory,
    removeFromHistory: removeSearchHistoryItem,
    clearHistory: clearSearchHistory,
  };
});

