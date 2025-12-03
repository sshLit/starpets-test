import { markRaw, ref } from 'vue';
import type { ModalAnimationType, ModalItem } from '~/shared/types/modal';

let idCounter = 0;

const modals = ref<ModalItem[]>([]);

export const useModal = () => {
  const open = (component: any, props?: Record<string, any>, animation: ModalAnimationType = 'fade') => {
    return new Promise((resolve) => {
      modals.value.push({
        id: ++idCounter,
        component: markRaw(component),
        props,
        animation,
        resolve,
      });
    });
  };

  const close = (id: number, result?: any) => {
    const index = modals.value.findIndex((m) => m.id === id);

    if (index !== -1 && modals.value[index]) {
      modals.value[index].resolve(result);
      modals.value.splice(index, 1);
    }
  };

  return { modals, open, close };
};
