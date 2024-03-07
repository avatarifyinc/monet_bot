import { Directive, DirectiveBinding, Ref } from 'vue';

import { clamp } from '@/ui/utility/clamp';

type Binding = {
  matrix: Ref<{
    scale: number;
    translate: { x: number; y: number };
  }>;
  onEvent: (scale: number, x: number, y: number) => void;
  onRelease: () => void;
};

type Fn = (...args: any) => void;

const dict = new Map<HTMLElement, Fn[]>();

function distance(a: PPointer, b: PPointer) {
  return Math.sqrt(Math.pow(a.cx - b.cx, 2) + Math.pow(a.cy - b.cy, 2));
}

function getCenter(a: PPointer, b: PPointer) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}

type PPointer = {
  id: number;
  x: number;
  y: number;
  cx: number;
  cy: number;
};

function mounted(el: HTMLElement, { value }: DirectiveBinding<Binding>) {
  let _distance = 0;
  let _scale = value.matrix.value.scale;

  let _pntrs: PPointer[] = [];
  let _prevCenter: Pick<PPointer, 'x' | 'y'> = { x: 0, y: 0 };

  function start(e: PointerEvent) {
    up(e);

    _pntrs.push({
      id: e.pointerId,
      x: e.offsetX,
      y: e.offsetY,
      cx: e.clientX,
      cy: e.clientY,
    });

    if (_pntrs.length > 1) {
      const a = _pntrs[0];
      const b = _pntrs[1];

      _distance = distance(a, b);
      _scale = value.matrix.value.scale;
      _prevCenter = getCenter(a, b);
    }
  }

  function move(e: PointerEvent) {
    if (_pntrs.length < 2) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    _pntrs = _pntrs.map((item) =>
      item.id === e.pointerId
        ? {
            id: e.pointerId,
            x: e.offsetX,
            y: e.offsetY,
            cx: e.clientX,
            cy: e.clientY,
          }
        : item
    );

    const a = _pntrs[0];
    const b = _pntrs[1];

    const d = distance(a, b);
    const s = (_scale * d) / _distance;
    const ns = clamp(s, 0.6, 5);

    const _pos = value.matrix.value.translate;

    const _x = _pos.x;
    const _y = _pos.y;

    const _cc = getCenter(a, b);
    const k = 0.1 + ((ns - 0.6) * (2 - 0.6)) / (5 - 0.6);

    const _diffX = (_cc.x - _prevCenter.x) * k;
    const _diffY = (_cc.y - _prevCenter.y) * k;

    const oldScale = value.matrix.value.scale;

    const __aa = _x + _diffX;
    const __bb = _y + _diffY;

    const x = (ns / oldScale) * (__aa - _cc.x) + _cc.x;
    const y = (ns / oldScale) * (__bb - _cc.y) + _cc.y;

    value.onEvent(ns, x, y);
  }

  function up(e: PointerEvent) {
    _pntrs = _pntrs.filter(({ id }) => id !== e.pointerId);

    value.onRelease();
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

    const oldScale = value.matrix.value.scale;
    const newScale = clamp(oldScale + step, 1, 5);

    const pos = value.matrix.value.translate;

    const x = (newScale / oldScale) * (pos.x - e.offsetX) + e.offsetX;
    const y = (newScale / oldScale) * (pos.y - e.offsetY) + e.offsetY;

    value.onEvent(newScale, x, y);
  }

  function touchmove(e: TouchEvent) {
    if (e.cancelable) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  el.addEventListener('pointerdown', start);
  el.addEventListener('pointermove', move);
  document.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);
  el.addEventListener('touchmove', touchmove);
  el.addEventListener('wheel', wheel);

  dict.set(el, [start, move, up, touchmove, wheel]);
}

function beforeUnmount(el: HTMLElement) {
  const q = dict.get(el);

  if (!q) {
    return;
  }

  el.removeEventListener('pointerdown', q[0]);
  el.removeEventListener('pointermove', q[1]);
  document.removeEventListener('pointerup', q[2]);
  el.removeEventListener('pointercancel', q[2]);
  el.removeEventListener('touchmove', q[3]);
  el.removeEventListener('wheel', q[4]);

  dict.delete(el);
}

export const ZoomDirective: Directive<HTMLElement, Binding> = {
  mounted,
  beforeUnmount,
};
