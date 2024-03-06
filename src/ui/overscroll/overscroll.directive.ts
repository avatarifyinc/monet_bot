import { Directive, DirectiveBinding } from 'vue';

export function canScroll(
  element: Element,
  rootElement: Element,
  vertical: boolean,
  scrollEnd: boolean
): boolean {
  return vertical
    ? canScrollVertical(element, rootElement, scrollEnd)
    : canScrollHorizontal(element, rootElement, scrollEnd);
}

function canScrollVertical(
  element: Element,
  rootElement: Element,
  scrollEnd: boolean
): boolean {
  let currentElement = element;

  while (currentElement !== rootElement.parentElement) {
    if (
      (Math.floor(currentElement.scrollTop) > 0 && !scrollEnd) ||
      (Math.ceil(currentElement.scrollTop + currentElement.clientHeight) <
        currentElement.scrollHeight &&
        scrollEnd)
    ) {
      return true;
    }

    if (currentElement.parentElement) {
      currentElement = currentElement.parentElement;
    } else {
      return false;
    }
  }

  return false;
}

function canScrollHorizontal(
  element: Element,
  rootElement: Element,
  scrollEnd: boolean
): boolean {
  let currentElement = element;

  while (currentElement !== rootElement.parentElement) {
    if (
      (Math.floor(currentElement.scrollLeft) > 0 && !scrollEnd) ||
      (Math.ceil(currentElement.scrollLeft + currentElement.clientWidth) <
        currentElement.scrollWidth &&
        scrollEnd)
    ) {
      return true;
    }

    if (currentElement.parentElement) {
      currentElement = currentElement.parentElement;
    } else {
      return false;
    }
  }

  return false;
}

type OverscrollMode = 'all' | 'scroll' | 'none';

type Fn = (...args: any[]) => void;

const listenersMap = new Map<HTMLElement, Fn[]>();

function isElement(
  node?: Element | EventTarget | Node | null
): node is Element {
  return !!node && `nodeType` in node && node.nodeType === Node.ELEMENT_NODE;
}

function getScrollParent(
  element: Element | null,
  vertical = true
): Element | null {
  if (element === null) {
    return null;
  }

  if (vertical && element.scrollHeight > element.clientHeight) {
    return element;
  }

  if (!vertical && element.scrollWidth > element.clientWidth) {
    return element;
  }

  return getScrollParent(element.parentElement, vertical);
}

const processEvent = (
  event: Event,
  vertical: boolean,
  negative: boolean,
  mode: OverscrollMode
) => {
  const { target, currentTarget, cancelable } = event;

  if (
    !cancelable ||
    !currentTarget ||
    !isElement(target) ||
    (target as HTMLInputElement)?.type === 'range'
  ) {
    return;
  }

  const typedCurrentTarget = currentTarget as HTMLElement;

  if (
    mode === 'all' &&
    ((vertical && !typedCurrentTarget.contains(getScrollParent(target))) ||
      (!vertical &&
        !typedCurrentTarget.contains(getScrollParent(target, false))))
  ) {
    event.preventDefault();

    return;
  }

  if (
    vertical &&
    ((negative && !canScroll(target, typedCurrentTarget, true, false)) ||
      (!negative && !canScroll(target, typedCurrentTarget, true, true)))
  ) {
    event.preventDefault();

    return;
  }

  if (
    !vertical &&
    ((negative && !canScroll(target, typedCurrentTarget, false, false)) ||
      (!negative && !canScroll(target, typedCurrentTarget, false, true)))
  ) {
    event.preventDefault();
  }
};

const createListeners = (el: HTMLElement, mode: OverscrollMode) => {
  const wheelHandler = (event: WheelEvent) => {
    processEvent(
      event,
      !!event.deltaY,
      event.deltaY ? event.deltaY < 0 : event.deltaX < 0,
      mode
    );
  };

  let clientX = 0;
  let clientY = 0;
  let deltaX = 0;
  let deltaY = 0;
  let vertical: boolean | undefined;

  const touchmoveHandler = (ev: TouchEvent) => {
    const changedTouch = ev.changedTouches[0];

    deltaX = clientX - changedTouch.clientX;
    deltaY = clientY - changedTouch.clientY;
    clientX = changedTouch.clientX;
    clientY = changedTouch.clientY;

    if (vertical === undefined) {
      vertical = Math.abs(deltaY) > Math.abs(deltaX);
    }

    processEvent(ev, vertical, vertical ? deltaY < 0 : deltaX < 0, mode);
  };

  const touchstartHandler = (event: TouchEvent) => {
    const touches = event.touches[0];

    clientX = touches.clientX;
    clientY = touches.clientY;

    deltaX = 0;
    deltaY = 0;
    vertical = undefined;

    el.removeEventListener('touchmove', touchmoveHandler);
    el.addEventListener('touchmove', touchmoveHandler, { passive: false });
  };

  return {
    wheelHandler,
    touchstartHandler,
    touchmoveHandler,
  };
};

const mounted = (
  element: HTMLElement,
  { value = 'all' }: DirectiveBinding<OverscrollMode>
) => {
  if (value === 'none') {
    return;
  }

  element.style.overscrollBehavior = 'contain';

  const { wheelHandler, touchmoveHandler, touchstartHandler } = createListeners(
    element,
    value
  );

  element.addEventListener('wheel', wheelHandler, { passive: false });
  element.addEventListener('touchstart', touchstartHandler, {
    passive: true,
  });

  listenersMap.set(element, [
    wheelHandler,
    touchmoveHandler,
    touchstartHandler,
  ]);
};

const beforeUnmount = (el: HTMLElement) => {
  const [wheel, move, start] = listenersMap.get(el) || [];

  if (wheel) {
    el.removeEventListener('wheel', wheel);
  }

  if (move) {
    el.removeEventListener('touchmove', move);
  }

  if (start) {
    el.removeEventListener('touchstart', start);
  }

  listenersMap.delete(el);
};

export const OverscrollDirective: Directive<HTMLElement, OverscrollMode> = {
  mounted,
  beforeUnmount,
};
