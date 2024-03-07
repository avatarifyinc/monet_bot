export type FlatButtonProps = {
  size?: 'xs' | 's' | 'm' | 'l' | string;
  icon?: string;
  appearance?: 'primary' | string;
  iconSize?: number | [number, number];
  disabled?: boolean;
};

export const FlatButtonDefaultProps = {
  size: 'm',
  appearance: 'primary',
} as const;
