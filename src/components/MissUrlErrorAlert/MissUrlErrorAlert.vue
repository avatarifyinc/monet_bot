<template>
  <div>
    <p class="tok-space_bottom-2">Send a picture to use AI Tools</p>

    <flat-button size="s" @click="context.close">
      Upload new picture
    </flat-button>
  </div>
</template>

<script setup lang="ts">
import { AlertContextProps } from '@/ui/Alert';
import { FlatButton } from '@/ui/FlatButton';

defineProps<AlertContextProps<unknown>>();
</script>
