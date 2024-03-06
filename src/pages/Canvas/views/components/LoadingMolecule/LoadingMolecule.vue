<script setup lang="ts">
withDefaults(defineProps<{ width: string; height: string }>(), {
  height: '100%',
  width: '100%',
});
</script>

<template>
  <div :class="['skeleton', $style.card]" />
</template>

<style module lang="scss">
.card {
  background-color: red;
  width: v-bind('width');
  height: v-bind('height');
  border-radius: var(--tok-radius-l);
}
</style>
