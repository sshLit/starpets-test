import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';

const STALE_TIME_MS = 1000 * 60 * 5;
const CACHE_TIME_MS = 1000 * 60 * 10;
const RETRY_ATTEMPTS = 2;
const RETRY_DELAY_MS = 1000;

function createQueryClient() {
  const config = useRuntimeConfig();

  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME_MS,
        gcTime: CACHE_TIME_MS,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
        retry: RETRY_ATTEMPTS,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, RETRY_DELAY_MS),
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export default defineNuxtPlugin({
  name: 'tanstack-query',
  enforce: 'pre',
  setup(nuxtApp) {
    const queryClient = createQueryClient();

    nuxtApp.vueApp.use(VueQueryPlugin, {
      queryClient,
    });

    if (process.dev) {
      queryClient.getQueryCache().subscribe((event) => {
        if (event?.type === 'updated') {
          console.info(`%c Query ${event.query.queryKey[0]} => `, 'background: #16161a; color: #4CD964;', {
            state: event.query.state.status,
            dataUpdatedAt: new Date(event.query.state.dataUpdatedAt).toLocaleTimeString(),
          });
        }
      });
    }
  },
});

