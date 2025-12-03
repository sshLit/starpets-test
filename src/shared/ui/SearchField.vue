<template>
  <label :class="fieldClasses" :for="inputFieldId">
    <UISvgIcon name="search" class="search-field__icon" />
    <input
      :id="inputFieldId"
      type="search"
      class="search-field__input"
      :placeholder="props.placeholder"
      :value="currentSearchValue"
      :disabled="props.disabled"
      :required="props.required"
      :readonly="props.readonly"
      :autocomplete="props.autocomplete"
      @input="handleInputChange"
      @focus="handleInputFocus"
      @blur="handleInputBlur"
    />
    <slot name="prepend" />
    <slot name="append" />
  </label>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface SearchFieldProps {
  modelValue?: string | number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  autocomplete?: string;
  id?: string;
}

const props = withDefaults(defineProps<SearchFieldProps>(), {
  modelValue: '',
  placeholder: '',
  disabled: false,
  required: false,
  readonly: false,
  autocomplete: undefined,
  id: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

function generateInputFieldId(): string {
  return props.id || `search-field-${Math.random().toString(36).substring(2, 11)}`;
}

const inputFieldId = computed(() => generateInputFieldId());
const currentSearchValue = computed(() => String(props.modelValue || ''));

const fieldClasses = computed(() => [
  'search-field',
  { 'search-field--disabled': props.disabled },
]);

function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement;

  emit('update:modelValue', target.value);
}

function handleInputFocus(event: FocusEvent) {
  emit('focus', event);
}

function handleInputBlur(event: FocusEvent) {
  emit('blur', event);
}
</script>

<style lang="scss" scoped>
.search-field {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background: var(--color-white);
  border-radius: 8px;
  border: 1px solid var(--color-grey-bg);
  transition: all ease-in-out 0.15s;
  cursor: text;
  padding: 4px 16px 4px 40px;
  min-height: 48px;

  &__icon {
    position: absolute;
    top: 0;
    left: 12px;
    bottom: 0;
    margin: auto 0;
    color: var(--color-grey-medium);
    width: 18px;
    height: 18px;
  }

  &__input {
    flex: 1;
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    color: var(--color-black);
    font-weight: 500;
    font-size: 16px;
    line-height: 1.5;
    padding: 0;

    &::placeholder {
      color: var(--color-grey-medium);
      opacity: 1;
    }

    &:disabled {
      cursor: not-allowed;
    }

    &[readonly] {
      cursor: default;
    }
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
}
</style>
