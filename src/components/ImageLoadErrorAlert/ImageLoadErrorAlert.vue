<template>
  <div>
    <p>Failed to load image</p>

    <flat-button
      v-if="!!context.data.generation_id && !error"
      size="s"
      :loading="loading"
      @click="onTry"
    >
      Try again
    </flat-button>

    <flat-button v-else size="s" @click="onUploadNew">
      Upload new image
    </flat-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { useTelegramSdk } from '@/telegram/use/sdk';
import { AlertContextProps } from '@/ui/Alert';
import { FlatButton } from '@/ui/FlatButton';
import { useApi } from '@/use/useApi';

const props = defineProps<AlertContextProps<{ generation_id: string }>>();

const api = useApi();
const sdk = useTelegramSdk();
const router = useRouter();

const loading = ref(false);
const error = ref(false);

const onUploadNew = () => {
  sdk.close();
  props.context.close();
};

const onTry = () => {
  const generation_id = props.context.data.generation_id;

  if (!generation_id) {
    return;
  }

  error.value = false;
  loading.value = true;

  api.refreshUrl
    .execute({ generation_id })
    .then((response) => {
      if (response) {
        if (response.generation_id && response.url) {
          router.replace({
            query: {
              generation_id: response.generation_id,
              url: response.url,
            },
          });

          props.context.close();
        } else {
          error.value = true;
        }
      }
    })
    .catch(() => {
      error.value = true;
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>
