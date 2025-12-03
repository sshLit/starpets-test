<template>
  <div class="user-avatar">
    <UIProductImage v-if="props.image" :image="props.image" :contain="false" class="user-avatar__image" />
    <UISvgIcon v-else name="avatar" class="user-avatar__fallback" />
  </div>
</template>

<script setup lang="ts">
interface UserAvatarProps {
  image?: string;
}

const props = defineProps<UserAvatarProps>();
</script>

<style lang="scss" scoped>
.user-avatar {
  flex-shrink: 0;
  border-radius: 500px;
  aspect-ratio: 1 / 1;
  min-width: 10px;
  overflow: hidden;
  border: 2.5px solid var(--color-orange-primary);
  padding: 2.5px;

  & > * {
    border-radius: 500px;
    overflow: hidden;
  }

  &__image,
  &__fallback {
    width: 46px;
    height: 46px;
  }

  &__fallback {
    color: var(--color-error);
  }
}
</style>
