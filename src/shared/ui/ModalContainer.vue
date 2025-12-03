<template>
  <Teleport to="body">
    <TransitionGroup @after-enter="onModalEnter">
      <div
        v-for="modalItem in activeModals"
        :key="modalItem.id"
        :ref="(el) => setModalElementRef(modalItem.id, el)"
        class="modal-container"
      >
        <Transition name="fade">
          <div
            v-if="isModalVisible(modalItem.id)"
            class="modal-container__overlay"
            @click.self="() => handleModalClose(modalItem.id)"
          />
        </Transition>
        <Transition :name="getModalAnimation(modalItem)" @after-leave="() => handleModalLeave(modalItem.id)">
          <component
            :is="modalItem.component"
            v-if="isModalVisible(modalItem.id)"
            v-bind="modalItem.props"
            @close="() => handleModalClose(modalItem.id)"
            @resolve="(data: any) => handleModalResolve(modalItem.id, data)"
          />
        </Transition>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, type ComponentPublicInstance } from 'vue';
import { useModal } from '~/shared/lib/useModal';

const { modals: activeModals, close: closeModal } = useModal();

const modalRefsMap = ref(new Map<number, Element>());
const visibleModalElementsSet = ref(new Set<Element>());
const pendingClosePayloadsMap = ref(new Map<number, any>());

function setModalElementRef(modalId: number, element: Element | ComponentPublicInstance | null) {
  if (element instanceof Element) {
    modalRefsMap.value.set(modalId, element);
  }
}

function isModalVisible(modalId: number) {
  const modalElement = modalRefsMap.value.get(modalId);
  return visibleModalElementsSet.value.has(modalElement);
}

function getModalAnimation(modalItem: any) {
  return modalItem.animation || 'fade';
}

function handleModalClose(modalId: number) {
  closeModalById(modalId);
}

function handleModalResolve(modalId: number, data: any) {
  closeModalById(modalId, data);
}

function handleModalLeave(modalId: number) {
  onModalLeave(modalId);
}

function closeModalById(modalId: number, payloadData?: any) {
  const modalElement = modalRefsMap.value.get(modalId);

  if (modalElement) {
    visibleModalElementsSet.value.delete(modalElement);
    pendingClosePayloadsMap.value.set(modalId, payloadData);
  }
}

function onModalEnter(enteredElement: Element) {
  visibleModalElementsSet.value.add(enteredElement);
}

function onModalLeave(modalId: number) {
  const payloadData = pendingClosePayloadsMap.value.get(modalId);
  closeModal(modalId, payloadData);
}
</script>

<style lang="scss" scoped>
.modal-container {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  &__overlay {
    position: absolute;
    inset: 0;
    background-color: var(--color-black-085);
    backdrop-filter: blur(7px);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-bottom-enter-active,
.slide-bottom-leave-active {
  transition: all 0.3s ease;
}

.slide-bottom-enter-from,
.slide-bottom-leave-to {
  transform: translateY(100%);
}
</style>
