import { Directive, DirectiveBinding } from 'vue';

type Binding = {
  onEvent: (a: any) => void;
};

const dict = new Map();

function mounted(el: HTMLElement, { value }: DirectiveBinding<Binding>) {
  let _startedPointer: PointerEvent | null = null;

  function onstart(e: PointerEvent) {
    if (_startedPointer === null) {
      e.stopPropagation();
      e.preventDefault();

      _startedPointer = e;
    }
  }

  function onmove(e: PointerEvent) {
    if (!_startedPointer || _startedPointer.pointerId !== e.pointerId) {
      return;
    }

    e.stopPropagation();
    e.preventDefault();

    value.onEvent([
      _startedPointer.clientX - e.clientX,
      _startedPointer.clientY - e.clientY,
    ]);

    _startedPointer = e;
  }

  function onup(e: PointerEvent) {
    if (e.pointerId === _startedPointer?.pointerId) {
      e.stopPropagation();
      e.preventDefault();

      _startedPointer = null;
    }
  }

  function tmove(e: TouchEvent) {
    if (e.cancelable) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  el.addEventListener('pointerdown', onstart);
  document.addEventListener('pointermove', onmove);
  document.addEventListener('pointerup', onup);
  el.addEventListener('touchmove', tmove);

  dict.set(el, [onstart, onmove, onup, tmove]);
}

function beforeUnmount(el: HTMLElement) {
  const d = dict.get(el);

  if (d) {
    el.removeEventListener('pointerdown', d[0]);
    document.removeEventListener('pointermove', d[1]);
    document.removeEventListener('pointerup', d[2]);
    el.removeEventListener('touchmove', d[3]);
  }

  dict.delete(el);
}

export const DragDirective: Directive<HTMLElement, Binding> = {
  mounted,
  beforeUnmount,
};
