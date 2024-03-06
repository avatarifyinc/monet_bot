import { Directive, DirectiveBinding, Ref } from 'vue';

import { clamp } from '@/ui/utility/clamp';

type Binding = {
  matrix: Ref<{
    scale: number;
  }>;
  onEvent: (val: number) => void;
};

type Fn = (...args: any) => void;

const dict = new Map<HTMLElement, Fn[]>();

function distance(a: Touch, b: Touch) {
  return Math.sqrt(
    Math.pow(a.clientX - b.clientX, 2) + Math.pow(a.clientY - b.clientY, 2)
  );
}

function mounted(el: HTMLElement, { value }: DirectiveBinding<Binding>) {
  let _distance = 0;
  let _scale = value.matrix.value.scale;

  function start(e: TouchEvent) {
    if (e.touches.length >= 2) {
      const a = e.touches[0];
      const b = e.touches[1];

      _distance = distance(a, b);
      _scale = value.matrix.value.scale;
    }
  }

  function move(e: TouchEvent) {
    if (e.touches.length > 1) {
      const a = e.touches[0];
      const b = e.touches[1];

      const d = distance(a, b);

      const factor = d / _distance;

      const s = _scale * factor;

      value.onEvent(clamp(s, 0.2, 50));
    }
  }

  function wheel(e: WheelEvent) {
    if (e.shiftKey) {
      return;
    }

    e.stopPropagation();
    e.preventDefault();

    const delta = Math.max(-1, Math.min(1, (e as any).wheelDelta || -e.detail));

    let step = Math.abs(e.deltaY) / 50;

    step = delta < 0 ? -step : step;

    const _value = clamp(value.matrix.value.scale + step, 0.2, 50);

    value.onEvent(_value);
  }

  el.addEventListener('touchstart', start);
  el.addEventListener('touchmove', move);
  el.addEventListener('wheel', wheel);

  dict.set(el, [start, move, wheel]);
}

function beforeUnmount(el: HTMLElement) {
  const q = dict.get(el);

  if (!q) {
    return;
  }

  el.removeEventListener('touchstart', q[0]);
  el.removeEventListener('touchmove', q[1]);
  el.removeEventListener('wheel', q[2]);

  dict.delete(el);
}

export const ZoomDirective: Directive<HTMLElement, Binding> = {
  mounted,
  beforeUnmount,
};
