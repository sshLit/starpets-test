<template>
  <component :is="loadedIconComponent" v-if="loadedIconComponent" />
</template>

<script setup lang="ts">
import type { ComponentImport } from '~/shared/types/component';

const props = defineProps<{ name?: string }>();

const svgIconsGlob = import.meta.glob('~/shared/assets/svg/*.svg', { eager: false }) as ComponentImport;
const iconCacheStorage = new Map<string, Component>();

const loadedIconComponent = shallowRef<Component | null>(null);

function buildIconPath(iconName: string): string {
  return `/shared/assets/svg/${iconName}.svg`;
}

async function fetchIconComponent(iconName: string): Promise<Component | null> {
  if (iconCacheStorage.has(iconName)) {
    return iconCacheStorage.get(iconName) || null;
  }

  const iconPath = buildIconPath(iconName);
  const iconLoader = svgIconsGlob[iconPath];

  if (!iconLoader) {
    return null;
  }

  try {
    const iconComponent = (await iconLoader()).default;

    iconCacheStorage.set(iconName, iconComponent);

    return iconComponent;
  } catch {
    return null;
  }
}

watch(
  () => props.name,
  async (newIconName) => {
    if (!newIconName) {
      loadedIconComponent.value = null;

      return;
    }

    loadedIconComponent.value = await fetchIconComponent(newIconName);
  },
  { immediate: true },
);
</script>
