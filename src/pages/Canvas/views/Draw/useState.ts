import { ref } from 'vue';

const stack = ref<ImageData[]>([]);

export function useState() {
  return { stack };
}
