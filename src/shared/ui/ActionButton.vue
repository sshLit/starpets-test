<template>
  <button
    class="action-button"
    :class="buttonClasses"
    :appearance="props.appearance"
    :disabled="isButtonDisabled"
  >
    <span class="action-button__content">
      <slot />
    </span>

    <template v-if="props.progress">
      <div class="action-button__progress"></div>
      <UISvgIcon name="progress" class="action-button__progress-icon size-12" />
    </template>
  </button>
</template>

<script lang="ts" setup>
import type { ButtonAppearance } from '~/shared/types/button';

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    active?: boolean;
    progress?: boolean;
    wide?: boolean;
    round?: boolean;
    ghost?: boolean;
    appearance?: ButtonAppearance;
    withoutPress?: boolean;
    withoutPadding?: boolean;
    size?: 'default' | 'xl';
  }>(),
  {
    disabled: false,
    active: false,
    progress: false,
    wide: false,
    round: false,
    ghost: false,
    withoutPress: false,
    withoutPadding: false,
    size: 'default',
  },
);

const buttonClasses = computed(() => ({
  'action-button--wide': props.wide,
  'action-button--round': props.round,
  'action-button--ghost': props.ghost,
  'action-button--with-press': !props.withoutPress,
  'action-button--without-padding': props.withoutPadding,
  'action-button--active': props.active,
  [`action-button--size-${props.size}`]: props.size,
}));

const isButtonDisabled = computed(() => props.disabled || props.progress);
</script>

<style lang="scss" scoped>
.action-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 30px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all ease-in-out 0.15s;
  white-space: nowrap;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  &[appearance='main'],
  &[appearance='primary'],
  &:not([appearance]):not(.action-button--ghost) {
    background: var(--button-primary-solid-background-default);
    color: var(--color-white);

    &:hover:not([disabled]) {
      background: var(--button-primary-solid-background-hover);
    }

    &:active:not([disabled]),
    &.action-button--active:not([disabled]) {
      background: var(--button-primary-solid-background-pressed);
    }

    &[disabled] {
      background: var(--button-primary-solid-background-disabled);
    }
  }

  &[appearance='secondary'] {
    background: var(--button-secondary-solid-background-default);
    color: var(--button-secondary-solid-text-default);

    &:hover:not([disabled]) {
      background: var(--button-secondary-solid-background-hover);
      color: var(--button-secondary-solid-text-hover);
    }

    &:active:not([disabled]),
    &.action-button--active:not([disabled]) {
      background: var(--button-secondary-solid-background-pressed);
      color: var(--button-secondary-solid-text-pressed);
    }

    &[disabled] {
      background: var(--button-secondary-solid-background-disabled);
      color: var(--button-secondary-solid-text-disabled);
    }
  }

  &[appearance='white'] {
    background: var(--color-white);
    color: var(--color-grey-lightest);
    border: 2px solid var(--color-grey-bg);

    &:hover:not([disabled]) {
      background: var(--color-grey-bg);
    }

    &:active:not([disabled]),
    &.action-button--active:not([disabled]) {
      background: var(--color-grey-bg);
    }

    &[disabled] {
      background: var(--color-white);
      opacity: 0.6;
    }
  }

  &--size-default {
    padding: 12px 24px;
    font-size: 16px;
  }

  &--size-xl {
    padding: 16px 32px;
    font-size: 18px;
    font-weight: 600;
    border-radius: 10px;
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__progress {
    position: absolute;
    width: 100%;
    height: 100%;
    background: inherit;
    box-shadow: inherit;
    border-radius: inherit;
    opacity: 0.95;
    top: 0;
    left: 0;

    &-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  &--wide {
    width: 100%;
  }

  &--round {
    border-radius: 120px;
  }

  &--ghost {
    background: transparent;
    padding: 0;
    box-shadow: none;
    border: none;
    text-decoration: none;

    &:hover:not([disabled]) {
      background: transparent;
      border: none;
      text-decoration: none;
    }

    &:focus,
    &:active {
      border: none;
      text-decoration: none;
      outline: none;
    }
  }

  &--without-padding {
    padding: 0;
  }

  &--with-press:not([disabled]):active,
  &--active {
    transform: scale(0.9);
  }
}
</style>
