<template>
  <div :class="$style.wrapper">
    <h3>Choose the style</h3>

    <div :class="$style.container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { useApi } from '@/use/useApi';

const api = useApi();

onMounted(() => {
  api.loadOutfits.execute().then(console.log).catch(console.error);
});
</script>

<style lang="scss" module>
.wrapper {
  padding: 1rem;
}

.container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>
