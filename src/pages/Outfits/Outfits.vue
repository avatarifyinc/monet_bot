<template>
  <div :class="$style.wrapper">
    <h3 style="margin-bottom: 1rem; display: flex; align-items: center">
      Choose the style <svg-icon v-if="submitLoading" name="spinner" />
    </h3>

    <div :class="$style.container">
      <button
        v-for="item in items"
        :key="item.name"
        :class="[$style.button, loading && 'tok-skeleton']"
        :style="{ backgroundImage: `url(${item.imageURL})` }"
        @click="onSubmit(item)"
      >
        <div :class="$style.button__overlay" />

        <span :class="$style.button__name">{{ item.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue';

import { useTelegramSdk } from '@/telegram/use/sdk';
import { SUBMIT_STATE } from '@/tokens';
import { SvgIcon } from '@/ui/SvgIcon';
import { useAlerts } from '@/ui/use/alerts';
import { costumesStub, DTOOutfitItem, DTOOutfits, useApi } from '@/use/useApi';

const sdk = useTelegramSdk();
const api = useApi();

const submitState = inject(SUBMIT_STATE)!;

const dto = ref<DTOOutfits | null>(null);
const loading = ref(false);
const submitLoading = ref(false);
const alertsService = useAlerts({ autoCloseOnUnmount: true });

const items = computed(() => {
  return loading.value ? costumesStub : dto.value?.costumes || [];
});

onMounted(() => {
  loading.value = true;

  api.loadOutfits
    .execute()
    .then((response) => {
      dto.value = response as any;
    })
    .catch(() => {
      alertsService.show('Failed to load outfits. Try again', {
        type: 'error',
      });
    })
    .finally(() => {
      loading.value = false;
    });
});

const onSubmit = (item: DTOOutfitItem) => {
  if (loading.value || submitLoading.value) {
    return;
  }

  submitLoading.value = true;

  api.sendOutfit
    .execute({
      preset: item.preset,
      title: item.name,
      generation_id: (submitState.value as any).generation_id || '',
    })
    .then(() => {
      sdk.close();
    })
    .catch(() => {
      alertsService.show('Failed to submit outfit. Try again', {
        type: 'error',
      });
    })
    .finally(() => {
      submitLoading.value = false;
    });
};
</script>

<style lang="scss" module>
@import '@/styles/local.scss';

.wrapper {
  padding: 1rem;
}

.container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.button {
  @include clearbutton;
  @include transition(transform);

  position: relative;

  border-radius: 0.75rem;

  height: 16.5rem;

  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;

  overflow: hidden;

  flex: 1;
  min-width: calc(50% - 0.5rem);
  max-width: calc(50% - 0.5rem);

  color: var(--tok-text-color);
  cursor: pointer;
  text-align: center;

  &__name {
    position: absolute;
    left: 0;
    bottom: 0.5rem;
    width: 100%;
    color: var(--tok-white);
  }

  &__overlay {
    position: absolute;

    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    background: linear-gradient(transparent, var(--tok-text-color));
  }

  @include hover {
    transform: scale(1.05);
  }
}
</style>
