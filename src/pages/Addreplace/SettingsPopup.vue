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

    <label
      for="__addreplaceForceInsert"
      style="display: block; margin-bottom: 1rem"
    >
      <toggle
        id="__addreplaceForceInsert"
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
      <flat-button size="m" style="flex: 1" @click="onSave"> Save </flat-button>

      <flat-button appearance="secondary" style="flex: 1" @click="onReset">
        Reset
      </flat-button>
    </div>
  </popup>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { FlatButton } from '@/ui/FlatButton';
import { InputText } from '@/ui/InputText';
import { Popup } from '@/ui/Popup';
import { Slider } from '@/ui/Slider';
import { Toggle } from '@/ui/Toggle';
import { useApi } from '@/use/useApi';

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

onMounted(() => {
  api.loadSettings.execute().then(console.log);
});

const onSave = () => {
  emit('update:opened', false);
  // api.saveSettings()
};

const onReset = () => {
  //   sliderOption.value = 0;
  //   forceInsert.value = false;
  //   negativePrompt.value = '';
  //   saved.value = false;
};
</script>

<style lang="scss" module></style>
