<template>
  <div :class="badgeClasses">
    {{ propertyLabel }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    type?: 'regular' | 'neon' | 'mega' | 'fly' | 'raid';
  }>(),
  {
    type: 'regular',
  },
);

const propertyLabel = computed(() => {
  const propertyLabelsMap: Record<string, string> = {
    regular: '-',
    neon: 'N',
    mega: 'M',
    fly: 'F',
    raid: 'R',
  };

  return propertyLabelsMap[props.type] || '-';
});

const badgeClasses = computed(() => [
  'product-property-badge',
  `product-property-badge--${props.type}`,
]);
</script>

<style lang="scss" scoped>
.product-property-badge {
  width: 18px;
  height: 18px;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  flex-shrink: 0;
  font-weight: 600;
  text-transform: uppercase;

  &--regular {
    background: transparent;
    color: var(--color-grey-lightest);
    border: 1px solid var(--color-grey-lightest);
  }

  &--neon {
    background: var(--color-green-primary);
    color: var(--color-white);
    border-radius: 50px;
  }

  &--mega {
    background: var(--color-purple-primary);
    color: var(--color-white);
  }

  &--fly {
    background: var(--color-blue-fly);
    color: var(--color-white);
    border-radius: 50px;
  }

  &--raid {
    background: var(--color-pink-primary);
    color: var(--color-white);
    border-radius: 50px;
  }
}
</style>
