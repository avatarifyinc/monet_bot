import { ref } from 'vue';

const stack = ref<ImageData[]>([]);
const undoIndex = ref(0);

export function useState() {
  const setPromptToLs = (id: string, prompt: string) => {
    localStorage.setItem(`__monet-${id}-prompt`, prompt);
  };

  const getPromptFromLs = (id: string) => {
    const a = localStorage.getItem(`__monet-${id}-prompt`);

    return a || '';
  };

  const pushStackToLs = (id: string, url: string) => {
    localStorage.setItem(`__monet-${id}-arm`, url);
  };

  const getFromLs = (id: string) => {
    if (stack.value.length > 0) {
      return null;
    }

    return localStorage.getItem(`__monet-${id}-arm`);
  };

  return {
    stack,
    undoIndex,
    getPromptFromLs,
    setPromptToLs,
    pushStackToLs,
    getFromLs,
  };
}
