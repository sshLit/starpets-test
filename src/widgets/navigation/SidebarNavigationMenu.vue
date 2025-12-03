<template>
  <nav class="sidebar-navigation-menu" :class="menuClasses">
    <div class="sidebar-navigation-menu__header">
      <button class="sidebar-navigation-menu__adopt-me-button" @click="toggleAdoptMeSection">
        <div class="sidebar-navigation-menu__adopt-me-icon">
          <UISvgIcon name="monkey" class="sidebar-navigation-menu__icon" />
        </div>
        <p class="sidebar-navigation-menu__adopt-me-text">Adopt Me</p>
        <UISvgIcon
          name="arrowRight"
          :class="adoptMeArrowClasses"
          class="sidebar-navigation-menu__arrow"
        />
      </button>
    </div>

    <div class="sidebar-navigation-menu__content">
      <div class="sidebar-navigation-menu__links">
        <NuxtLink
          v-for="menuLink in navigationLinks"
          :key="menuLink.path"
          :to="menuLink.path"
          :class="getLinkClasses(menuLink.path)"
          class="sidebar-navigation-menu__link"
          @click="handleLinkClick"
        >
          <UIColorBadge :color="menuLink.badgeColor" size="md">
            <UISvgIcon :name="menuLink.icon" class="sidebar-navigation-menu__link-icon" />
          </UIColorBadge>
          <p class="sidebar-navigation-menu__link-text">{{ menuLink.label }}</p>
        </NuxtLink>
      </div>
    </div>

    <div class="sidebar-navigation-menu__footer">
      <p class="sidebar-navigation-menu__copyright">© 2020-2023 STARPETS.GG All Rights Reserved</p>
    </div>
  </nav>
</template>

<script setup lang="ts">
const currentRoute = useRoute();

const props = defineProps<{
  isOpen?: boolean;
}>();

const emit = defineEmits<{
  'update:isOpen': [value: boolean];
  close: [];
}>();

const isMenuVisible = computed(() => props.isOpen ?? false);
const isAdoptMeSectionExpanded = ref(false);

const navigationLinks = [
  { path: '/', label: 'Магазин', icon: 'cart', badgeColor: 'orange' as const },
  { path: '/products', label: 'Предметы', icon: 'box', badgeColor: 'blue' as const },
  { path: '/sale', label: 'Продажа', icon: 'lightning', badgeColor: 'purple' as const },
  { path: '/rbx', label: 'Робуксы', icon: 'coin', badgeColor: 'pink' as const },
  { path: '/help', label: 'Помощь', icon: 'help', badgeColor: 'green' as const },
];

function toggleAdoptMeSection() {
  isAdoptMeSectionExpanded.value = !isAdoptMeSectionExpanded.value;
}

function isLinkActive(linkPath: string) {
  if (linkPath === '/') {
    return currentRoute.path === '/';
  }

  return currentRoute.path.startsWith(linkPath);
}

function handleLinkClick() {
  emit('update:isOpen', false);
  emit('close');
}

const menuClasses = computed(() => ({
  'sidebar-navigation-menu--visible': isMenuVisible.value,
}));

const adoptMeArrowClasses = computed(() => ({
  'sidebar-navigation-menu__arrow--expanded': isAdoptMeSectionExpanded.value,
}));

function getLinkClasses(linkPath: string) {
  return {
    'sidebar-navigation-menu__link--active': isLinkActive(linkPath),
  };
}
</script>

<style lang="scss" scoped>
.sidebar-navigation-menu {
  position: fixed;
  top: 82px;
  left: 0;
  width: 100%;
  max-width: 360px;
  height: calc(100% - 82px);
  background: var(--color-white);
  display: flex;
  flex-direction: column;
  overflow: auto;
  z-index: 102;
  transform: translateX(-100%);
  transition: transform 0.3s ease;

  &--visible {
    transform: translateX(0);
  }
}

.sidebar-navigation-menu__header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-grey-bg);
}

.sidebar-navigation-menu__adopt-me-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  width: 100%;
  border: none;
  border-radius: 8px;
  background: var(--color-grey-bg);
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: var(--color-grey-bg-light);
  }
}

.sidebar-navigation-menu__adopt-me-icon {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--color-purple-primary);
  color: var(--color-white);
  flex-shrink: 0;
}

.sidebar-navigation-menu__icon {
  width: 24px;
  height: 24px;
}

.sidebar-navigation-menu__adopt-me-text {
  flex: 1;
  color: var(--color-text-black);
  font-size: 16px;
  font-weight: 500;
  text-align: left;
}

.sidebar-navigation-menu__arrow {
  width: 18px;
  height: 18px;
  transition: transform 0.2s ease;
  transform: rotate(90deg);
  color: var(--color-grey-medium);
  flex-shrink: 0;

  &--expanded {
    transform: rotate(-90deg);
  }
}

.sidebar-navigation-menu__content {
  flex: 1;
  padding: 24px;
}

.sidebar-navigation-menu__links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-navigation-menu__link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s ease;
  cursor: pointer;

  &:hover {
    background: var(--color-grey-bg-light);
  }

  &--active {
    background: var(--color-grey-bg);
  }
}

.sidebar-navigation-menu__link-icon {
  width: 24px;
  height: 24px;
}

.sidebar-navigation-menu__link-text {
  color: var(--color-text-black);
  font-size: 16px;
  font-weight: 500;
}

.sidebar-navigation-menu__footer {
  padding: 20px 24px;
  text-align: center;
  border-top: 1px solid var(--color-grey-bg);
}

.sidebar-navigation-menu__copyright {
  font-size: 12px;
  color: var(--color-grey-lightest);
}

@media (min-width: 1440px) {
  .sidebar-navigation-menu {
    display: none;
  }
}
</style>
