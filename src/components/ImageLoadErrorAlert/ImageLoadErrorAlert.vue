<template>
  <div>
    <p>Failed to load image {{ context.data.generationId }}</p>

    <flat-button
      v-if="context.data.generationId"
      appearance="secondary"
      size="s"
      :loading="loading"
      @click="onTry"
    >
      Try again
    </flat-button>

    <p v-else>Try reload the page</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { AlertContextProps } from '@/ui/Alert';
import { FlatButton } from '@/ui/FlatButton';

defineProps<
  AlertContextProps<{
    generationId?: string;
  }>
>();

const loading = ref(false);

const onTry = () => {
  loading.value = true;
};
</script>
