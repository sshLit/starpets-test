import type { User } from '~/shared/types/user';
import { userApi } from '../api';

export const useUserStore = defineStore('userStore', () => {
  const currentUser = ref<User | null>(null);
  const requestInProgress = ref(false);
  const requestError = ref<string | null>(null);

  function updateUser(userData: User) {
    currentUser.value = userData;
  }

  async function authenticateUser() {
    requestInProgress.value = true;
    requestError.value = null;

    try {
      const authResponse = await userApi.login();

      updateUser({
        balance: authResponse.balance,
        login: authResponse.login,
      });
    } catch (err) {
      requestError.value = err instanceof Error ? err.message : 'При авторизации произошла ошибка';
      throw err;
    } finally {
      requestInProgress.value = false;
    }
  }

  const hasAuthenticatedUser = computed(() => !!currentUser.value);

  return {
    user: currentUser,
    isLoading: requestInProgress,
    error: requestError,
    isAuthenticated: hasAuthenticatedUser,
    setUser: updateUser,
    login: authenticateUser,
  };
});

