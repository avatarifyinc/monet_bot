import { Directive, DirectiveBinding, Ref } from 'vue';

type Binding = {
  matrix: Ref<{
    deg: number;
  }>;
  onEvent: (val: number) => void;
};

type Fn = (...args: any[]) => void;

const dictMap = new Map<HTMLElement, Fn[]>();

function getAngle(e: TouchEvent) {
  const a = e.touches[0];
  const b = e.touches[1];

  return (
    (Math.atan2(b.clientY - a.clientY, b.clientX - a.clientX) * 180) / Math.PI
  );
}

// function getCenter(e: TouchEvent) {
//   const a = e.touches[0];
//   const b = e.touches[1];

//   return {
//     x: (a.clientX + b.clientX) / 2,
//     y: (a.clientY + b.clientY) / 2,
//   };
// }

function mounted(el: HTMLElement, { value }: DirectiveBinding<Binding>) {
  let _start: number | null = null;
  let angle = value.matrix.value.deg;

  // let _rotationPoint = { x: 0, y: 0 };

  const start = (e: TouchEvent) => {
    if (e.touches.length >= 2) {
      _start = getAngle(e);
      // _rotationPoint = getCenter(e);
    }
  };

  const move = (event: TouchEvent) => {
    if (event.touches.length >= 2) {
      if (_start === null) {
        _start = getAngle(event);
        // _rotationPoint = getCenter(event);

        return;
      }

      const curr = getAngle(event);

      // todo: will it break reserve transformation?
      // (
      //   event.target as HTMLElement
      // ).style.transformOrigin = `${_rotationPoint.x}px ${_rotationPoint.y}px`;

      angle += curr - _start;

      value.onEvent(angle);

      _start = curr;
    }
  };

  el.addEventListener('touchstart', start);

  el.addEventListener('touchmove', move);

  function wheel(e: WheelEvent) {
    if (!e.shiftKey) {
      return;
    }

    e.stopPropagation();
    e.preventDefault();

    const delta = Math.max(-1, Math.min(1, (e as any).wheelDelta || -e.detail));

    const step = Math.abs(e.deltaY) / 2;

    angle += delta < 0 ? -step : step;

    value.onEvent(angle);
  }

  el.addEventListener('wheel', wheel);

  dictMap.set(el, [start, move, wheel]);
}

function beforeUnmount(el: HTMLElement) {
  const val = dictMap.get(el);

  if (!val) {
    return;
  }

  el.removeEventListener('touchstart', val[0]);
  el.removeEventListener('touchmove', val[1]);
  el.removeEventListener('wheel', val[2]);

  dictMap.delete(el);
}

export const RotateDirective: Directive = {
  mounted,
  beforeUnmount,
};
