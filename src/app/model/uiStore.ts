export const useUiStore = defineStore('uiStore', () => {
  const filtersPanelVisible = ref(false);
  const navigationMenuVisible = ref(false);

  function showFiltersPanel() {
    filtersPanelVisible.value = true;
  }

  function hideFiltersPanel() {
    if (typeof window !== 'undefined' && window.innerWidth >= 1440) {
      return;
    }
    filtersPanelVisible.value = false;
  }

  function switchFiltersPanel() {
    if (filtersPanelVisible.value) {
      hideFiltersPanel();
    } else {
      showFiltersPanel();
    }
  }

  function showNavigationMenu() {
    navigationMenuVisible.value = true;
  }

  function hideNavigationMenu() {
    navigationMenuVisible.value = false;
  }

  function switchNavigationMenu() {
    if (navigationMenuVisible.value) {
      hideNavigationMenu();
    } else {
      showNavigationMenu();
    }
  }

  return {
    isAsideOpen: filtersPanelVisible,
    isNavigationOpen: navigationMenuVisible,
    openAside: showFiltersPanel,
    closeAside: hideFiltersPanel,
    toggleAside: switchFiltersPanel,
    openNavigation: showNavigationMenu,
    closeNavigation: hideNavigationMenu,
    toggleNavigation: switchNavigationMenu,
  };
});

