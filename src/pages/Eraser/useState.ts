import { ref } from 'vue';

const stack = ref<ImageData[]>([]);
const undoIndex = ref(0);

export function useState() {
  const pushStackToLs = (id: string, url: string) => {
    localStorage.setItem(`__monet-${id}-eracermask`, url);
  };

  const getFromLs = (id: string) => {
    if (stack.value.length > 0) {
      return null;
    }

    return localStorage.getItem(`__monet-${id}-eracermask`);
  };

  return { stack, undoIndex, pushStackToLs, getFromLs };
}
