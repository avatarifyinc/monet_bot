<template>
  <div :class="$style.wrapper">
    <h3 style="margin-bottom: 0.5rem">AI Tools</h3>

    <div :class="$style.items">
      <component
        v-for="feature in features"
        :key="feature.title"
        :is="feature.comp"
        :to="feature.to"
        :class="$style.card"
        @click="onClick(feature.title)"
      >
        <video
          autoplay
          muted
          loop
          playsinline
          preload="auto"
          :poster="feature.poster"
          :class="$style.card__video"
        >
          <source :src="feature.video" type="video/mp4" />
        </video>

        <div :class="$style.card__surface" />

        <p :class="$style.card__name">
          {{ feature.title }}
          <svg-icon
            v-if="
              feature.title === 'Upscale'
                ? loadingUpscale
                : feature.title === 'Generate image'
                ? loadingTexttoimg
                : false
            "
            name="spinner"
          />
        </p>
      </component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { useRouter } from 'vue-router';

import addReplace from '@/assets/video/cover-addreplace.mp4';
import poster_addReplace from '@/assets/video/cover-addreplace.webp';
import eraser from '@/assets/video/cover-eraser.mp4';
import poster_eraser from '@/assets/video/cover-eraser.webp';
import generate from '@/assets/video/cover-generate.mp4';
import poster_generate from '@/assets/video/cover-generate.webp';
import outfits from '@/assets/video/cover-outfits.mp4';
import poster_outfits from '@/assets/video/cover-outfits.webp';
import uncrop from '@/assets/video/cover-uncrop.mp4';
import poster_uncrop from '@/assets/video/cover-uncrop.webp';
import upscale from '@/assets/video/cover-upscale.mp4';
import poster_upscale from '@/assets/video/cover-upscale.webp';
import { useTelegramSdk } from '@/telegram/use/sdk';
import { SUBMIT_STATE } from '@/tokens';
import { SvgIcon } from '@/ui/SvgIcon';
import { useAlerts } from '@/ui/use/alerts';
import { useApi } from '@/use/useApi';

const sdk = useTelegramSdk();
const alertsService = useAlerts({ autoCloseOnUnmount: true });
const api = useApi();
const router = useRouter();

const submitState = inject(SUBMIT_STATE)!;

const loadingUpscale = ref(false);
const loadingTexttoimg = ref(false);

const query = computed(() => router.currentRoute.value.query);

const features = computed(() => {
  const q = query.value;

  return [
    {
      title: 'Add & Replace',
      video: addReplace,
      comp: 'router-link',
      to: {
        path: '/addreplace',
        query: q,
      },
      poster: poster_addReplace,
    },
    {
      title: 'Outfits',
      video: outfits,
      comp: 'router-link',
      to: {
        path: '/outfits',
        query: q,
      },
      poster: poster_outfits,
    },
    {
      title: 'Upscale',
      video: upscale,
      comp: 'button',
      to: undefined,
      poster: poster_upscale,
    },
    {
      title: 'Eraser',
      video: eraser,
      comp: 'router-link',
      to: {
        path: '/eraser',
        query: q,
      },
      poster: poster_eraser,
    },
    {
      title: 'Uncrop',
      video: uncrop,
      comp: 'router-link',
      to: {
        path: '/uncrop',
        query: q,
      },
      poster: poster_uncrop,
    },
    {
      title: 'Generate image',
      video: generate,
      comp: 'button',
      to: undefined,
      poster: poster_generate,
    },
  ];
});

const onClick = (item: string) => {
  if (item === 'Upscale') {
    if (loadingUpscale.value) {
      return;
    }

    loadingUpscale.value = true;

    api.upscale
      .execute({ generation_id: submitState.value!.generation_id as string })
      .then(() => {
        sdk.close();
      })
      .catch(() => {
        alertsService.show('Failed to upscale image. Try again', {
          type: 'error',
        });
      })
      .finally(() => {
        loadingUpscale.value = false;
      });
  } else if (item === 'Generate image') {
    if (loadingTexttoimg.value) {
      return;
    }

    loadingTexttoimg.value = true;

    api.txt2img
      .execute()
      .then(() => {
        sdk.close();
      })
      .catch(() => {
        alertsService.show('Failed to generate image. Try again', {
          type: 'error',
        });
      })
      .finally(() => {
        loadingTexttoimg.value = false;
      });
  }
};
</script>

<style module lang="scss">
@import '@/styles/local.scss';

.wrapper {
  padding: 0.5rem;
}

.items {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  @include clearbutton;
  @include transition(transform);

  position: relative;
  display: block;

  min-width: calc(50% - 0.5rem);
  max-width: calc(50% - 0.5rem);

  aspect-ratio: 1/1.2;
  color: var(--tok-white);
  border-radius: var(--tok-radius-m);
  overflow: hidden;

  cursor: pointer;

  &__video {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__surface {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      0deg,
      rgba(27, 27, 29, 0.56) 0%,
      rgba(27, 27, 29, 0) 50%
    );
  }

  &__name {
    position: absolute;

    display: flex;
    align-items: center;

    bottom: var(--tok-padding-s);
    left: var(--tok-padding-m);

    font: var(--tok-font-s);
  }

  @include hover {
    transform: scale(1.05);
    opacity: 1;
  }
}
</style>
