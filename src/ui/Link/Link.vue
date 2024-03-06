<template>
  <router-link class="tok-text_l" :to="to">
    <slot />

    <svg-icon name="arrow-right" :size="16" />
  </router-link>
</template>

<script setup lang="ts">
import { RouteLocationRaw } from 'vue-router';

import { SvgIcon } from '@/ui/SvgIcon';

defineProps<{ to: RouteLocationRaw }>();
</script>
