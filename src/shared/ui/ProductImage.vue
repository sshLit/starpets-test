<template>
  <picture v-if="imageSourceUrl" class="product-image" :class="imageClasses">
    <source v-if="props.compressed" :srcset="props.compressed" type="image/webp" />
    <img v-if="!hasImageError" :src="imageSourceUrl" :alt="props.alt" @error="handleImageError" />
    <slot v-else name="error">
      <UISvgIcon name="monster" />
    </slot>
  </picture>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    image?: string;
    compressed?: string;
    contain?: boolean;
    alt?: string;
  }>(),
  {
    contain: true,
  },
);

const imageSourceUrl = ref(props.image);
const hasImageError = ref(false);

watch(
  () => props.image,
  (newImageUrl) => {
    hasImageError.value = false;
    imageSourceUrl.value = newImageUrl || '';
  },
);

function handleImageError() {
  hasImageError.value = true;
}

const imageClasses = computed(() => ({
  'product-image--contain': props.contain,
}));
</script>

<style lang="scss" scoped>
.product-image {
  display: block;
  position: relative;
  -webkit-tap-highlight-color: transparent;
  user-select: none;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &--contain img {
    object-fit: contain;
  }
}
</style>
