<script setup lang="ts">
import { Modal } from "bootstrap";
import { onMounted, ref } from "vue";
import type { Game } from "../api";
import { Field, Form } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

const emit = defineEmits<{
  (e: "onClose"): void;
  (e: "onSubmit", values: Game): void;
  (e: "onDelete", values: Game): void;
}>();

const { game } = defineProps<{ game?: Game | undefined }>();
const modalInstance = ref<Modal | null>(null);

const validationSchema = toTypedSchema(
  zod.object({
    publisherId: zod
      .string()
      .trim()
      .min(1, { message: "Publisher ID is required" }),
    name: zod
      .string()
      .trim()
      .min(2, { message: "Name must be at least 2 characters" })
      .max(100, { message: "Name cannot exceed 100 characters" }),
    bundleId: zod
      .string()
      .trim()
      .min(1, { message: "Bundle ID is required" })
      .regex(/^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+[0-9a-z_]$/i, {
        message:
          "Bundle ID must be in reverse domain format (e.g., com.company.app)",
      }),
    platform: zod.enum(["ios", "android"], {
      errorMap: () => ({
        message: "Platform must be either 'ios' or 'android'",
      }),
    }),
    storeId: zod.string({
      required_error: "Store ID is required",
    }),
    appVersion: zod
      .string()
      .trim()
      .min(1, { message: "App version is required" })
      .regex(
        /^(0|[1-9]\d*)(\.(0|[1-9]\d*))*(\-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?(\+[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?$/,
        {
          message:
            "App version must be in valid versioning format (e.g., 1.2.3, 1.216.1.1, 2.0.0-beta.1)",
        },
      ),
    isPublished: zod.boolean(),
  }),
);

const cleanupModal = () => {
  const backdrops = document.querySelectorAll(".modal-backdrop");
  backdrops.forEach((backdrop) => backdrop.remove());

  document.body.classList.remove("modal-open");
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";

  if (modalInstance.value) {
    modalInstance.value.dispose();
    modalInstance.value = null;
  }
};

onMounted(() => {
  const element = document.getElementById("gameModal");
  if (!!element) {
    modalInstance.value = Modal.getOrCreateInstance(element!, {
      backdrop: "static",
    });

    element!.addEventListener("hidden.bs.modal", (_) => {
      cleanupModal();
      emit("onClose");
    });

    modalInstance.value.show();
  }
});

const showFieldError = (path: keyof Game, errors: Record<string, any>) => {
  return { "form-control": true, "is-invalid": !!errors[path] };
};

const onSubmitClicked = (values: unknown) => {
  if (game?.id) {
    (values as Game).id = game.id;
  }

  const modalElement = document.getElementById("gameModal");
  if (modalElement) {
    modalInstance.value?.hide();
    cleanupModal();
  }

  emit("onSubmit", values as Game);
};

const onDeleteClicked = () => {
  cleanupModal();
  emit("onDelete", game!);
};
</script>
<template>
  <Form
    class="needs-validation"
    novalidate
    :validation-schema="validationSchema"
    :initial-values="game"
    @submit="onSubmitClicked"
    v-slot="{ errors }"
  >
    <div id="gameModal" class="modal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <template v-if="!!game"> {{ game.name }}</template>
              <template v-else> Submit a new Game</template>
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <!-- Form fields remain unchanged -->
            <div class="mb-3">
              <label for="publisherIdTextInput" class="form-label"
                >Publisher identifier</label
              >
              <Field
                id="publisherIdTextInput"
                name="publisherId"
                type="text"
                :class="showFieldError('publisherId', errors)"
                placeholder="Your publisher id"
              />
              <div class="invalid-feedback">
                {{ errors.publisherId }}
              </div>
            </div>
            <!-- Other fields remain the same -->
            <!-- ... -->
            <div class="mb-3">
              <label for="applicationNameInput" class="form-label"
                >Application name</label
              >
              <Field
                id="applicationNameInput"
                name="name"
                type="text"
                :class="showFieldError('name', errors)"
                placeholder="eg: My Faboulous chess game"
              />
              <div class="invalid-feedback">
                {{ errors.name }}
              </div>
            </div>
            <div class="mb-3">
              <label for="platformRadioInput" class="form-label"
                >Platform</label
              >
              <div class="form-check">
                <Field
                  class="form-check-input"
                  type="radio"
                  name="platform"
                  id="iOSPlatform"
                  value="ios"
                  checked
                />
                <label class="form-check-label" for="iOSPlatform"> iOS </label>
              </div>
              <div class="form-check">
                <Field
                  class="form-check-input"
                  type="radio"
                  name="platform"
                  id="androidPlatform"
                  value="android"
                />
                <label class="form-check-label" for="androidPlatform">
                  Android
                </label>
              </div>
              <div class="radio-error">
                {{ errors.platform }}
              </div>
            </div>
            <div class="mb-3">
              <label for="storeIdTextInput" class="form-label"
                >Store identifier</label
              >
              <Field
                id="storeIdTextInput"
                name="storeId"
                type="text"
                :class="showFieldError('storeId', errors)"
                placeholder="Your store identifier..."
              />
              <div class="invalid-feedback">
                {{ errors.storeId }}
              </div>
            </div>
            <div class="mb-3">
              <label for="bundleIdTextInput" class="form-label"
                >Bundle identifier</label
              >
              <Field
                id="bundleIdTextInput"
                name="bundleId"
                type="text"
                :class="showFieldError('bundleId', errors)"
                placeholder="com.xx.xx"
              />
              <div class="invalid-feedback">
                {{ errors.bundleId }}
              </div>
            </div>
            <div class="mb-3">
              <label for="applicationVersionTextInput" class="form-label"
                >Application version</label
              >
              <Field
                id="applicationVersionTextInput"
                name="appVersion"
                type="text"
                :class="showFieldError('appVersion', errors)"
                placeholder="eg: 2.3.4"
              />
              <div class="invalid-feedback">
                {{ errors.appVersion }}
              </div>
            </div>
            <div class="mb-3">
              <label for="publicationRadioInput" class="form-label"
                >Published</label
              >
              <div class="form-check">
                <Field
                  class="form-check-input"
                  type="radio"
                  name="isPublished"
                  id="publishedYes"
                  :value="true"
                />
                <label class="form-check-label" for="publishedYes"> Yes </label>
              </div>
              <div class="form-check">
                <Field
                  class="form-check-input"
                  type="radio"
                  name="isPublished"
                  id="publishedNo"
                  :value="false"
                />
                <label class="form-check-label" for="publishedNo"> No </label>
              </div>
              <div class="radio-error">
                {{ errors.isPublished }}
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div v-if="!!game" class="float-left">
              <button
                id="deleteButton"
                type="button"
                class="btn btn-danger"
                @click="onDeleteClicked"
              >
                Delete
              </button>
            </div>

            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button type="submit" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  </Form>
</template>
<style scoped>
.modal-footer .float-left {
  display: flex;
  flex-grow: 1;
}

.radio-error {
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: var(--bs-form-invalid-color);
}
</style>
