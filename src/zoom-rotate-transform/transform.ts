import { Directive, DirectiveBinding } from 'vue';

type Binding = {
  onEvent: (dxdy: [number, number]) => void;
  onPanning: (value: boolean) => void;
};

type Fn = (e: PointerEvent) => void;

const dictMap = new Map<HTMLElement, [Fn, Fn, Fn]>();

function mounted(el: HTMLElement, { value }: DirectiveBinding<Binding>) {
  let _startedPointer: PointerEvent | null = null;

  function ondown(e: PointerEvent) {
    if (_startedPointer === null) {
      e.stopPropagation();
      e.preventDefault();

      _startedPointer = e;

      value.onPanning(true);
    }
  }

  function onmove(e: PointerEvent) {
    if (!_startedPointer || _startedPointer.pointerId !== e.pointerId) {
      return;
    }

    e.stopPropagation();
    e.preventDefault();

    const dx = e.clientX - _startedPointer.clientX;
    const dy = e.clientY - _startedPointer.clientY;

    value.onEvent([dx, dy]);

    _startedPointer = e;
  }

  function onup(e: PointerEvent) {
    if (e.pointerId === _startedPointer?.pointerId) {
      e.stopPropagation();
      e.preventDefault();

      _startedPointer = null;

      value.onPanning(false);
    }
  }

  el.addEventListener('pointerdown', ondown);
  document.addEventListener('pointermove', onmove);
  document.addEventListener('pointerup', onup);

  dictMap.set(el, [ondown, onmove, onup]);
}

function beforeUnmount(el: HTMLElement) {
  const val = dictMap.get(el);

  if (!val) {
    return;
  }

  el.removeEventListener('pointerdown', val[0]);
  document.removeEventListener('pointermove', val[1]);
  document.removeEventListener('pointerup', val[2]);

  dictMap.delete(el);
}

export const TransformDirective: Directive<HTMLElement, Binding> = {
  mounted,
  beforeUnmount,
};
