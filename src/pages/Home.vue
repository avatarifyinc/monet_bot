<script setup lang="ts">
import addReplace from '@/assets/video/cover-addreplace.mp4';
import poster_addReplace from '@/assets/video/cover-addreplace.webp';
import uncrop from '@/assets/video/cover-uncrop.mp4';
import poster_uncrop from '@/assets/video/cover-uncrop.webp';

const FEATURE_HEIGHT = '16.5rem';
const STYLE = { minHeight: FEATURE_HEIGHT, width: '100%' };

const features = [
  {
    title: 'Add&Replace',
    video: addReplace,
    path: '/addreplace',
    poster: poster_addReplace,
  },
  // {
  //   title: 'AI Outfits',
  //   video: outfits,
  //   poster: poster_outfits,
  // },
  // {
  //   title: 'AI Upscale',
  //   video: upscale,
  //   path: null,
  //   poster: poster_upscale,
  // },
  // {
  //   title: 'Eraser',
  //   video: eraser,
  //   path: null,
  //   poster: poster_eraser,
  // },
  {
    title: 'Uncrop',
    video: uncrop,
    path: '/uncrop',
    poster: poster_uncrop,
  },
  // {
  //   title: 'Generate image',
  //   video: generate,
  //   path: null,
  //   poster: poster_generate,
  // },
];
</script>

<template>
  <div :class="$style.wrapper">
    <h1 :class="$style.title">AI Edits</h1>
    <div :class="$style.featureList">
      <div
        v-for="feature in features"
        :key="feature.title"
        :class="$style.feature"
      >
        <component
          :is="feature.path ? 'router-link' : 'div'"
          :to="feature.path"
          :style="STYLE"
        >
          <video
            autoplay
            muted
            loop
            playsinline
            preload="auto"
            :poster="feature.poster"
          >
            <source :src="feature.video" type="video/mp4" />
          </video>

          <h2 class="tok-text_l">{{ feature.title }}</h2>
        </component>
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
$gap: var(--tok-padding-s);

.wrapper {
  max-width: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}

.title {
  font: var(--tok-font-h1);
  margin-bottom: $gap;
}

.featureList {
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  gap: $gap;
}

.feature {
  height: v-bind(FEATURE_HEIGHT);
  width: calc(50% - $gap / 2);
  position: relative;
  border-radius: var(--tok-radius-l);
  overflow: hidden;

  & video {
    position: absolute;
    max-height: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  & h2 {
    position: absolute;
    text-align: center;
    width: 100%;
    padding: var(--tok-padding-m);
    bottom: var(--tok-padding-s);
    color: var(--tok-white);
  }
}
</style>
