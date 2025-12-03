<template>
  <nav class="mobile-bottom-navigation">
    <NuxtLink
      v-for="menuItem in navigationMenuItems"
      :key="menuItem.path"
      :to="menuItem.path"
      class="mobile-bottom-navigation__link"
      :class="getNavigationLinkClasses(menuItem.path)"
    >
      <UIColorBadge :color="menuItem.color" size="md" class="mobile-bottom-navigation__badge">
        <UISvgIcon :name="menuItem.icon" class="mobile-bottom-navigation__icon" />
      </UIColorBadge>
      <p class="mobile-bottom-navigation__label">{{ menuItem.label }}</p>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
interface NavigationMenuItem {
  path: string;
  label: string;
  icon: string;
  color: 'orange' | 'blue' | 'purple' | 'pink' | 'green';
}

const currentRoute = useRoute();

const navigationMenuItems: NavigationMenuItem[] = [
  { path: '/', label: 'Магазин', icon: 'cart', color: 'orange' },
  { path: '/products', label: 'Предметы', icon: 'box', color: 'blue' },
  { path: '/rbx', label: 'R$', icon: 'coin', color: 'pink' },
  { path: '/sale', label: 'Продажа', icon: 'lightning', color: 'purple' },
  { path: '/profile', label: 'Профиль', icon: 'account', color: 'green' },
];

function checkIsRouteActive(path: string) {
  if (path === '/') {
    return currentRoute.path === '/';
  }

  return currentRoute.path.startsWith(path);
}

function getNavigationLinkClasses(path: string) {
  return {
    'mobile-bottom-navigation__link--active': checkIsRouteActive(path),
  };
}
</script>

<style lang="scss" scoped>
.mobile-bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 8px 0;
  padding-bottom: calc(8px + env(safe-area-inset-bottom));
  background: var(--color-white);
  border-top: 1px solid var(--color-grey-bg);
  z-index: 100;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  min-height: 64px;

  @media (min-width: 1020px) {
    display: none;
  }
}

.mobile-bottom-navigation__link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 12px;
  text-decoration: none;
  transition: opacity 0.2s ease;
  flex: 1;
  max-width: 80px;

  &:hover {
    opacity: 0.8;
  }

  &--active {
    .mobile-bottom-navigation__label {
      color: var(--color-text-black);
      font-weight: 600;
    }
  }
}

.mobile-bottom-navigation__badge {
  margin-bottom: 0;
}

.mobile-bottom-navigation__icon {
  width: 24px;
  height: 24px;
}

.mobile-bottom-navigation__label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-grey-lightest);
  text-align: center;
  transition:
    color 0.2s ease,
    font-weight 0.2s ease;
  line-height: 1.2;
}
</style>
