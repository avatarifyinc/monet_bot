<template>
  <slot />

  <slot name="overContent" />

  <alerts-host />

  <slot name="overAlerts" />
</template>

<script setup lang="ts">
import AlertsHost from './AlertsHost.vue';
import { RootSlots } from './Root.props';

defineSlots<RootSlots>();
</script>

<style lang="scss" module>
.host {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0;
}
</style>
