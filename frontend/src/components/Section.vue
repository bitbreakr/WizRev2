<script setup lang="ts">
const { name } = defineProps<{ name: string }>();
</script>
<template>
  <div class="container">
    <div class="canopy">
      <div class="canopy-content">
        <h2>{{ name }}</h2>
        <div class="actions">
          <slot name="actions"></slot>
        </div>
      </div>
      <hr class="hr-clean" />
    </div>

    <slot name="content"></slot>
  </div>
</template>
<style scoped>
.container {
  margin-top: 2rem;
}

.container .canopy {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.container .canopy .canopy-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.container .canopy h2 {
  margin-bottom: 0px;
}

.container .canopy .actions {
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: end;
  gap: 0.5rem;
}

/* HR clean style */
.hr-clean {
  border: 0;
  height: 1px;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.75),
    rgba(0, 0, 0, 0)
  );
  margin: 15px 0 0 0;
  width: 100%;
}
</style>
