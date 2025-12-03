<template>
  <div class="market-activity-card" :class="{ 'market-activity-card--expanded': isExpanded }">
    <UISvgIcon name="sliderIcon" class="market-activity-card__icon" />
    <div class="market-activity-card__content">
      <p v-if="isExpanded" class="market-activity-card__label">Сделок за все время</p>
      <p class="market-activity-card__value" :class="{ 'market-activity-card__value--spaced': isExpanded }">
        {{ formattedTotalTransactions }}
      </p>
      <p v-if="!isExpanded" class="market-activity-card__description market-activity-card__description--transactions">
        Сделок за все время
      </p>
      <p class="market-activity-card__label market-activity-card__label--with-indicator">
        {{ formattedActiveUsers }} {{ isExpanded ? 'в сети' : '' }}
      </p>
      <p v-if="!isExpanded" class="market-activity-card__description">
        Пользователей в сети
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface MarketActivityCardProps {
  totalTransactions?: number;
  activeUsers?: number;
  isExpanded?: boolean;
}

const props = withDefaults(defineProps<MarketActivityCardProps>(), {
  totalTransactions: 0,
  activeUsers: 0,
  isExpanded: false,
});

function formatNumber(value: number): string {
  return value.toLocaleString('ru-RU');
}

const formattedTotalTransactions = computed(() => {
  return formatNumber(props.totalTransactions);
});

const formattedActiveUsers = computed(() => {
  return formatNumber(props.activeUsers);
});
</script>

<style lang="scss" scoped>
.market-activity-card {
  position: relative;
  width: 160px;
  height: 125px;
  padding: 24px 20px;
  border-radius: 8px;
  overflow: hidden;

  &--expanded {
    width: 400px;
  }

  &__icon {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  &__content {
    position: absolute;
    z-index: 1;
    top: 0;
    bottom: 0;
    margin: auto;
    right: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
  }

  &__label {
    color: var(--color-grey-medium);
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 6px;

    &--with-indicator {
      position: relative;

      &::before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: -16px;
        bottom: 0;
        margin: auto;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        border: 2px solid var(--color-green-primary-light-border);
        background: var(--color-green-primary);
      }
    }
  }

  &__value {
    color: var(--color-text-black);
    font-weight: 700;
    font-size: 18px;
    margin-bottom: 6px;

    &--spaced {
      margin-bottom: 24px;
    }
  }

  &__description {
    color: var(--color-grey-medium);
    font-weight: 500;
    font-size: 10px;
    max-width: 100%;
    margin-top: 10px;

    &--transactions {
      margin-bottom: 10px;
    }
  }

  &:not(.market-activity-card--expanded) {
    padding-left: 10px;

    .market-activity-card__icon {
      transform: rotate(190deg) scale(0.4) translate(-120px, 150px);
    }

    .market-activity-card__content {
      right: auto;
      left: 10px;
      align-items: flex-start;
      text-align: left;
    }

    .market-activity-card__label--with-indicator {
      margin-left: 16px;
    }

    .market-activity-card__description {
      margin-top: 0;
    }
  }
}
</style>

