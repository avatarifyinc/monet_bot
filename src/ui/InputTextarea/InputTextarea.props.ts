export type InputTextareaProps<T = string | null> = {
  modelValue: T;
  placeholder?: string;
  pseudoFocused?: boolean;

  expandable?: boolean;

  rows?: number;
};

export const InputTextareaDefaultProps = {
  expandable: true,
  rows: 9,
} as const;
