export type FlatButtonProps = {
  size?: 'xs' | 's' | 'm' | 'l' | string;
  icon?: string;
  appearance?: 'primary' | string;
};

export const FlatButtonDefaultProps = {
  size: 'm',
  appearance: 'primary',
} as const;
