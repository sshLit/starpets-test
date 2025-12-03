<template>
  <div class="default-layout">
    <Header />

    <div
      v-if="shouldDisplayFiltersOverlay"
      class="default-layout__filters-overlay"
      :class="filtersOverlayClasses"
      @click="uiStore.closeAside"
    />

    <div
      v-if="shouldDisplayNavigationOverlay"
      class="default-layout__navigation-overlay"
      :class="navigationOverlayClasses"
      @click="uiStore.closeNavigation"
    />

    <main class="default-layout__main">
      <ProductFiltersPanel
        :is-open="isFiltersPanelOpen"
        :class="filtersPanelClasses"
        @update:is-open="handleFiltersPanelUpdate"
        @close="uiStore.closeAside"
      />

      <SidebarNavigationMenu
        :is-open="isNavigationOpen"
        @update:is-open="handleNavigationUpdate"
        @close="uiStore.closeNavigation"
      />

      <NuxtPage />
    </main>

    <MobileBottomNavigation />

    <UIModalContainer />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUiStore } from '~/app/model/uiStore';
import ProductFiltersPanel from '~/features/products-filter/ui/ProductFiltersPanel.vue';

const uiStore = useUiStore();
const { isNavigationOpen, isAsideOpen: isFiltersPanelOpen } = storeToRefs(uiStore);
const currentRoute = useRoute();

const viewportWidth = ref(0);

const DESKTOP_BREAKPOINT = 1440;
const TABLET_BREAKPOINT = 1024;

function updateViewportWidth() {
  viewportWidth.value = window.innerWidth;
  if (window.innerWidth >= DESKTOP_BREAKPOINT) {
    uiStore.openAside();
  } else {
    uiStore.closeAside();
  }
}

function handleFiltersPanelUpdate(value: boolean) {
  if (window.innerWidth >= DESKTOP_BREAKPOINT) {
    uiStore.openAside();
  } else {
    if (value) {
      uiStore.openAside();
    } else {
      uiStore.closeAside();
    }
  }
}

function closeNavigationOnRouteChange() {
  if (isNavigationOpen.value) {
    uiStore.closeNavigation();
  }
  if (isFiltersPanelOpen.value && viewportWidth.value < DESKTOP_BREAKPOINT) {
    uiStore.closeAside();
  }
}

const shouldDisplayFiltersOverlay = computed(() => {
  return viewportWidth.value > 0 && viewportWidth.value < DESKTOP_BREAKPOINT;
});

const shouldDisplayNavigationOverlay = computed(() => {
  return viewportWidth.value > 0 && viewportWidth.value < TABLET_BREAKPOINT;
});

const filtersOverlayClasses = computed(() => ({
  'default-layout__filters-overlay--visible': isFiltersPanelOpen.value,
}));

const navigationOverlayClasses = computed(() => ({
  'default-layout__navigation-overlay--visible': isNavigationOpen.value,
  'default-layout__navigation-overlay--open': isNavigationOpen.value,
}));

const filtersPanelClasses = computed(() => ({
  'aside-open': isFiltersPanelOpen.value,
}));

function handleNavigationUpdate(value: boolean) {
  if (value) {
    uiStore.openNavigation();
  } else {
    uiStore.closeNavigation();
  }
}

onMounted(() => {
  updateViewportWidth();
  window.addEventListener('resize', updateViewportWidth);

  onUnmounted(() => {
    window.removeEventListener('resize', updateViewportWidth);
  });
});

watch(() => currentRoute.path, closeNavigationOnRouteChange);
</script>

<style lang="scss" scoped>
.default-layout {
  :deep(aside) {
    position: fixed;
    top: 82px;
    left: 0;
    max-width: 360px;
    height: calc(100% - 82px);
    transform: translateX(0);
    transition: transform 0.3s ease;

    @media (max-width: 1439px) {
      top: 0;
      height: 100%;
      transform: translateX(-100%);

      &.aside-open {
        transform: translateX(0);
      }
    }

    @media (max-width: 743px) {
      max-width: 100%;
      width: 100%;
    }
  }

  :deep(.sidebar-navigation-menu) {
    @media (min-width: 1440px) {
      display: none;
    }
  }

  &__main {
    display: flex;
    padding-top: 82px;
    padding-left: 360px;
    padding-bottom: 0;
    transition: padding-left 0.3s ease;

    @media (max-width: 1439px) {
      padding-left: 0;
    }

    @media (max-width: 1019px) {
      padding-bottom: calc(80px + env(safe-area-inset-bottom));
    }
  }

  &__filters-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--color-black-050);
    z-index: 101;
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0.3s ease,
      visibility 0.3s ease;
    cursor: pointer;

    &--visible {
      opacity: 1;
      visibility: visible;
    }

    @media (min-width: 1440px) {
      display: none;
    }
  }

  &__navigation-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--color-black-050);
    z-index: 100;
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0.3s ease,
      visibility 0.3s ease;
    cursor: pointer;

    &--visible {
      opacity: 1;
      visibility: visible;
    }

    &--open {
      z-index: 99;
    }

    @media (min-width: 1024px) {
      display: none;
    }
  }
}
</style>

