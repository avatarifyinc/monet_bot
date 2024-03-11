import type { RouteLocationRaw } from 'vue-router';

import type { SvgIconProps } from '@/ui/SvgIcon';

export type FlatButtonProps = {
  size?: 'xs' | 's' | 'm' | 'l' | string;
  icon?: string;
  rotate?: boolean;
  iconRight?: string;
  rightRotate?: boolean;
  shape?: 'square' | 'rounded' | 'vertical' | null;
  appearance?: 'primary' | 'secondary' | 'ghost' | string;
  loading?: boolean;
  disabled?: boolean;
  iconButton?: boolean;
  href?: string;
  to?: RouteLocationRaw;

  iconSize?: SvgIconProps['size'];
};

export const FlatButtonDefaultProps = {
  size: 'm',
  appearance: 'primary',
  shape: null,
} as const;
