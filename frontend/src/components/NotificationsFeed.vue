<script setup lang="ts">
import { Toast } from "bootstrap";
import type { Notification } from "../store/user-experience.store.ts";
import { onUpdated } from "vue";

const { data } = defineProps<{ data: Notification[] }>();
const emit = defineEmits<{
  (e: "onClose", index: number): void;
}>();

onUpdated(() => {
  for (let [index, _] of data.entries()) {
    const dom = document.getElementById(`toast-${index}`);
    dom!.addEventListener("hidden.bs.toast", () => {
      emit("onClose", index);
    });

    const toast = new Toast(dom!);
    toast.show();
  }
});
</script>
<template>
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <template v-for="(notification, idx) in data" :key="idx">
      <div
        :id="`toast-${idx}`"
        class="toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="toast-header">
          <svg
            class="bd-placeholder-img rounded me-2"
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            preserveAspectRatio="xMidYMid slice"
          >
            <rect width="100%" height="100%" fill="#007aff"></rect>
          </svg>
          <strong class="me-auto">{{ notification.title }}</strong>
          <small class="text-body-secondary">j</small>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div class="toast-body">{{ notification.content }}</div>
      </div>
    </template>
  </div>
</template>
