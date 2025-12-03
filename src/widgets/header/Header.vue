<template>
  <header class="header">
    <div class="header__left">
      <UIActionButton
        v-show="shouldShowMenuButton"
        :appearance="ButtonAppearance.secondary"
        without-padding
        ghost
        class="header__menu-button"
        @click="handleMenuButtonClick"
      >
        <UISvgIcon name="menu" class="header__menu-icon" />
      </UIActionButton>

      <NuxtLink to="/" class="header__logo">
        <UISvgIcon name="logo" class="header__logo-full" />
        <UIProductImage :image="logoMiniImage" class="header__logo-mini" />
      </NuxtLink>

      <div class="header__tabs">
        <NuxtLink
          v-for="navigationItem in NAVIGATION_ITEMS"
          :key="navigationItem.path"
          :to="navigationItem.path"
          class="header__nav-link"
        >
          <p class="header__nav-text">{{ navigationItem.label }}</p>
        </NuxtLink>
      </div>
    </div>

    <div class="header__right">
      <UIActionButton
        v-if="shouldShowBalanceButton"
        :appearance="ButtonAppearance.secondary"
        without-padding
        ghost
        class="header__balance-button"
      >
        <div class="header__info-wrapper">
          <div class="header__info">
            <p class="header__info-value">{{ formattedUserBalance }}</p>
            <p class="header__info-label">Ваш баланс</p>
          </div>

          <UIActionButton :appearance="ButtonAppearance.primary" without-padding class="header__balance-add">
            <p class="header__balance-add-icon">+</p>
          </UIActionButton>
        </div>
      </UIActionButton>

      <UIActionButton
        v-if="shouldShowBalanceButton"
        :appearance="ButtonAppearance.secondary"
        without-padding
        ghost
        class="header__flag-button"
      >
        <UISvgIcon name="russia" class="header__flag-icon" />
      </UIActionButton>

      <UIActionButton
        v-if="shouldShowProfileButton"
        :appearance="ButtonAppearance.secondary"
        without-padding
        ghost
        class="header__profile-button"
      >
        <div class="header__info-wrapper">
          <div class="header__info header__profile-info">
            <p class="header__info-value">{{ currentUser?.login }}</p>
            <p class="header__info-label">Профиль</p>
          </div>

          <UIUserAvatar :image="avaImage" class="header__profile-avatar" />
        </div>
      </UIActionButton>

      <UIActionButton
        :appearance="ButtonAppearance.secondary"
        without-padding
        class="header__cart-button"
        @click="isShoppingCartDropdownVisible = !isShoppingCartDropdownVisible"
      >
        <div class="header__info-wrapper">
          <UIActionButton :appearance="ButtonAppearance.primary" without-padding class="header__cart-icon-button">
            <UISvgIcon name="cartWhite" class="header__cart-icon" />
            <div v-show="shoppingCartItemsCount > 0" class="header__cart-count">
              {{ shoppingCartItemsCount }}
            </div>
          </UIActionButton>

          <div class="header__info header__cart-info">
            <p class="header__info-label">К покупке</p>
            <p class="header__info-value">{{ formattedShoppingCartTotal }}</p>
          </div>

          <UISvgIcon
            name="arrowRight"
            :class="cartArrowClasses"
            class="header__cart-arrow"
          />
        </div>
      </UIActionButton>

      <div v-show="shouldShowCartDropdown" class="header__cart-dropdown">
        <div class="header__cart-dropdown-row">
          <UIColorBadge color="orange" size="md">
            <UISvgIcon name="cartBagOrange" />
          </UIColorBadge>
          <p class="header__cart-dropdown-title">{{ shoppingCartItemsCount }} предмета(-ов) в корзине</p>
        </div>

        <div class="header__cart-dropdown-list">
          <CartProductCard
            v-for="product in shoppingCartItems"
            :key="product.id"
            :product="product"
            @remove="removeProductFromCart"
          />
        </div>

        <div class="header__cart-dropdown-total">
          <p class="header__cart-dropdown-total-label">Сумма покупки</p>
          <p class="header__cart-dropdown-total-value">{{ formattedShoppingCartTotal }}</p>
        </div>

        <UIActionButton
          :appearance="ButtonAppearance.primary"
          wide
          class="header__cart-dropdown-buy"
          @click="handlePurchaseClick"
        >
          <UISvgIcon name="cartWhite" class="header__cart-dropdown-buy-icon" />
          <p>Купить</p>
        </UIActionButton>

        <UIActionButton
          :appearance="ButtonAppearance.secondary"
          wide
          class="header__cart-dropdown-clear"
          @click="clearShoppingCart"
        >
          <p>Очистить корзину</p>
        </UIActionButton>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ButtonAppearance } from '~/shared/types';
import { NAVIGATION_ITEMS } from '~/shared/config';
import { formatCurrencyAmount } from '~/shared/lib/useCurrencyFormatter';
import { useUserStore } from '~/entities/user/model/userStore';
import { useCartStore } from '~/features/add-to-cart/model/cartStore';
import { useUiStore } from '~/app/model/uiStore';
import avaImage from '~/shared/assets/images/avatar.jpg';
import logoMiniImage from '~/shared/assets/images/logoMini.png';

const isShoppingCartDropdownVisible = ref(false);
const screenWidth = ref(0);

const userStore = useUserStore();
const cartStore = useCartStore();
const uiStore = useUiStore();

const {
  clearCart: clearShoppingCart,
  purchaseCart: purchaseShoppingCart,
  removeFromCart: removeProductFromCart,
} = cartStore;

const { login: authenticateUser } = userStore;
const { toggleNavigation: toggleNavigationMenu } = uiStore;

function handleMenuButtonClick() {
  toggleNavigationMenu();
}

function handlePurchaseClick() {
  purchaseShoppingCart();
  isShoppingCartDropdownVisible.value = false;
}

const { isAuthenticated: isUserAuthenticated, user: currentUser } = storeToRefs(userStore);
const { cart: shoppingCartItems, cartTotal: shoppingCartTotalAmount } = storeToRefs(cartStore);

const shouldShowMenuButton = computed(() => screenWidth.value >= 1020 && screenWidth.value < 1440);

const shouldShowBalance = computed(() => screenWidth.value >= 1020);

const shouldShowBalanceButton = computed(() => isUserAuthenticated.value && shouldShowBalance.value);

const shouldShowProfileButton = computed(() => isUserAuthenticated.value && shouldShowBalance.value);

const shouldShowCartDropdown = computed(() => isShoppingCartDropdownVisible.value);

const formattedUserBalance = computed(() => {
  const balanceAmount = currentUser.value?.balance ?? 0;

  return formatCurrencyAmount(balanceAmount);
});

const shoppingCartItemsCount = computed(() => shoppingCartItems.value.length);

const formattedShoppingCartTotal = computed(() => {
  const totalAmount = shoppingCartTotalAmount.value ?? 0;

  return formatCurrencyAmount(totalAmount);
});

const cartArrowClasses = computed(() => ({
  'is-active': isShoppingCartDropdownVisible.value,
}));

function initializeAuthentication() {
  // Сюда можно свою авторизацию воткнуть, либо сделать по кнопке например
  authenticateUser();
}

function handleResize() {
  screenWidth.value = window.innerWidth;
}

onMounted(() => {
  initializeAuthentication();
  handleResize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style lang="scss">
.header {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  background: var(--color-white);

  &__left,
  &__right {
    display: flex;
    align-items: center;
    height: 100%;
  }

  &__left {
    @media (max-width: 1023px) {
      gap: 0;
    }
  }

  &__right {
    gap: 24px;
  }

  &__menu-button {
    width: 32px;
    height: 32px;
    margin-left: 8px;
  }

  &__menu-icon {
    width: 24px;
    height: 24px;
  }

  &__logo {
    margin-left: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__logo-full {
    width: 201px;
    height: 32px;

    @media (max-width: 439px) {
      display: none !important;
    }
  }

  &__logo-mini {
    display: none !important;
    width: 50px;
    height: 40px;

    @media (max-width: 439px) {
      display: block !important;
    }
  }

  &__tabs {
    display: flex;
    align-items: center;
    height: 100%;

    @media (max-width: 1439px) {
      display: none;
    }
  }

  &__nav-link {
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 8px;
    color: var(--color-grey-light);
    text-decoration: none;

    &.is-active,
    &:hover {
      color: var(--color-black);

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0 auto;
        width: 40px;
        height: 3px;
        background: var(--color-orange-primary);
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
      }
    }

    &:not(.is-active) {
      cursor: pointer;
    }

    &.is-active {
      cursor: default;
    }
  }

  &__nav-text {
    font-size: 18px;
    font-weight: 500;
  }

  &__info-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    gap: 4px;
    min-width: 60px;
    color: var(--color-black);
  }

  &__info-value {
    font-weight: 600;
  }

  &__info-label {
    font-size: 14px;
  }

  &__balance-button {
    @media (max-width: 1019px) {
      display: none !important;
    }
  }

  &__balance-add {
    width: 48px;
    height: 48px;
  }

  &__balance-add-icon {
    font-size: 32px;
  }

  &__profile-button {
    @media (max-width: 1019px) {
      display: none !important;
    }
  }

  &__profile-info {
    @media (max-width: 1439px) {
      display: none;
    }
  }

  &__flag-button {
    width: 56px;
    height: 56px;
    border-radius: 500px;
    overflow: hidden;
    position: relative;

    @media (max-width: 1019px) {
      display: none !important;
    }

    :deep(.action-button__content) {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
    }
  }

  &__flag-icon {
    width: 30px;
    height: 30px;

    :deep(svg) {
      width: 30px;
      height: 30px;
      display: block;
    }
  }

  &__profile-avatar {
    width: 56px;
    height: 56px;
  }

  &__cart-button {
    height: 100%;
    padding: 0 16px;
    border-radius: 0;
  }

  &__cart-icon-button {
    width: 48px;
    height: 48px;
  }

  &__cart-icon {
    width: 24px;
    height: 24px;
  }

  &__cart-count {
    position: absolute;
    top: -10px;
    right: -10px;
    min-width: 20px;
    height: 20px;
    border-radius: 6px;
    background: var(--color-white);
    color: var(--color-black);
    font-weight: 700;
  }

  &__cart-info {
    @media (max-width: 1024px) {
      display: none;
    }
  }

  &__cart-arrow {
    width: 18px;
    height: 18px;
    transition: transform 0.2s ease-in-out;
    transform: rotate(90deg);

    &.is-active {
      transform: rotate(270deg);
    }

    @media (max-width: 1024px) {
      display: none;
    }
  }

  &__cart-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    right: 10px;
    width: 450px;
    max-height: 570px;
    padding: 14px;
    background: var(--color-white);
    border-radius: 8px;
    box-shadow: var(--box-shadow-dropdown);
  }

  &__cart-dropdown-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__cart-dropdown-title {
    font-size: 18px;
    font-weight: 500;
  }

  &__cart-dropdown-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 20px 0;
    max-height: 280px;
    overflow: auto;
  }

  &__cart-dropdown-total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px;
    margin-top: 10px;
    border-radius: 8px;
    color: var(--color-grey-lightest);
    background-color: var(--color-grey-bg-light);
  }

  &__cart-dropdown-total-label {
    font-weight: 500;
  }

  &__cart-dropdown-total-value {
    font-weight: 700;
    color: var(--color-black);
  }

  &__cart-dropdown-buy {
    margin-top: 10px;
  }

  &__cart-dropdown-buy-icon {
    width: 24px;
    height: 24px;
  }

  &__cart-dropdown-clear {
    margin-top: 10px;
  }
}
</style>
