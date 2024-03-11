import { DirectiveBinding, ObjectDirective } from 'vue';

interface HoveredHTMLElement extends HTMLElement {
  __arkHoveredDirectiveMouseEnter: (() => void) | null;
  __arkHoveredDirectiveMouseLeave: (() => void) | null;
}

type HoveredBinding = {
  onEvent: (hovered: boolean) => void;
};

export const HoveredDirective: ObjectDirective<HoveredHTMLElement> = {
  mounted(
    element: HoveredHTMLElement,
    { value }: DirectiveBinding<HoveredBinding>
  ) {
    const onMouseEnter = () => {
      value.onEvent(true);
    };

    const onMouseLeave = () => {
      value.onEvent(false);
    };

    element.__arkHoveredDirectiveMouseEnter = onMouseEnter;
    element.__arkHoveredDirectiveMouseLeave = onMouseLeave;

    element.addEventListener('mouseenter', onMouseEnter);
    element.addEventListener('mouseleave', onMouseLeave);
  },
  beforeUnmount(element: HoveredHTMLElement) {
    if (element.__arkHoveredDirectiveMouseEnter) {
      element.removeEventListener(
        'mouseenter',
        element.__arkHoveredDirectiveMouseEnter
      );
      element.__arkHoveredDirectiveMouseEnter = null;
    }

    if (element.__arkHoveredDirectiveMouseLeave) {
      element.removeEventListener(
        'mouseleave',
        element.__arkHoveredDirectiveMouseLeave
      );
      element.__arkHoveredDirectiveMouseLeave = null;
    }
  },
};
