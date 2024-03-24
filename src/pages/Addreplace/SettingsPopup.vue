<template>
  <popup
    :model-value="opened"
    @update:model-value="emit('update:opened', $event)"
  >
    <div
      style="
        display: flex;
        justify-content: space-between;
        font: var(--tok-font-l);
        margin-bottom: 0.5rem;
      "
    >
      <h6>Image strength</h6>

      <p style="color: var(--tok-primary)">{{ imageStrength }}</p>
    </div>

    <Slider
      style="margin-bottom: 1rem"
      :model-value="imageStrength"
      :max="10"
      :segments="0"
      @update:model-value="emit('update:imageStrength', $event)"
    />

    <h6 style="font: var(--tok-font-l); margin-bottom: 0.5rem">
      Negative prompt
    </h6>

    <input-text
      placeholder="What you don't want to generate?"
      style="margin-bottom: 1rem"
      :model-value="negativePrompt"
      @update:model-value="emit('update:negativePrompt', $event || '')"
    />

    <label for="ForceInsert" style="display: block; margin-bottom: 1rem">
      <toggle
        id="ForceInsert"
        size="m"
        :model-value="forceInsert"
        @update:model-value="emit('update:forceInsert', $event)"
      />
      <span style="font: var(--tok-font-l); margin-left: 0.5rem">
        Force insert
      </span>
    </label>

    <div
      style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      "
    >
      <flat-button size="m" style="flex: 1" :loading="loading" @click="onSave">
        Save
      </flat-button>

      <flat-button appearance="secondary" style="flex: 1" @click="onReset">
        Reset
      </flat-button>
    </div>
  </popup>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { FlatButton } from '@/ui/FlatButton';
import { InputText } from '@/ui/InputText';
import { Popup } from '@/ui/Popup';
import { Slider } from '@/ui/Slider';
import { Toggle } from '@/ui/Toggle';
import { DTOSettings, useApi } from '@/use/useApi';

const props = defineProps<{
  opened: boolean;
  imageStrength: number;
  forceInsert: boolean;
  negativePrompt: string;
}>();

const emit = defineEmits<{
  (e: 'update:opened', value: boolean): void;
  (e: 'update:imageStrength', value: number): void;
  (e: 'update:forceInsert', value: boolean): void;
  (e: 'update:negativePrompt', value: string): void;
}>();

const resetState = {
  imageStrength: props.imageStrength,
  forceInsert: props.forceInsert,
  negativePrompt: props.negativePrompt,
};

const api = useApi();

const loading = ref(false);

let dto: DTOSettings | null = null;

onMounted(() => {
  api.loadSettings
    .execute()
    .then((response) => {
      if (response) {
        dto = response;

        emit('update:negativePrompt', response.negative_prompt || '');
      }
    })
    .catch(() => null);
});

const onSave = () => {
  loading.value = true;

  api.saveSettings
    .execute(
      dto
        ? {
            ...dto,
            negative_prompt: props.negativePrompt,
          }
        : {
            style: 'no style',
            aspect_ratio: [],
            negative_prompt: props.negativePrompt,
          }
    )
    .then(() => {
      emit('update:opened', false);
    })
    .finally(() => {
      loading.value = false;
    });
};

const onReset = () => {
  emit('update:forceInsert', resetState.forceInsert);
  emit('update:imageStrength', resetState.imageStrength);
  emit('update:negativePrompt', resetState.negativePrompt);
};
</script>

<style lang="scss" module></style>
