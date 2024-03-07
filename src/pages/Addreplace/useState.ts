import { ref } from 'vue';

const stack = ref<ImageData[]>([]);
const undoIndex = ref(0);

export function useState() {
  return { stack, undoIndex };
}
