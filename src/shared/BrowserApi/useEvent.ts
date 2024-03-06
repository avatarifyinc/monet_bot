import { onBeforeUnmount, onMounted } from 'vue';

type UseEventOptions = {
  target?: EventTarget;
  listener?: boolean | AddEventListenerOptions;
};

export const useEvent = (
  event: string,
  handler: EventListenerOrEventListenerObject,
  options: UseEventOptions = {}
): void => {
  const { target = window, listener } = options;

  onMounted(() => {
    target.addEventListener(event, handler, listener);
  });

  onBeforeUnmount(() => {
    target.removeEventListener(event, handler, listener);
  });
};
