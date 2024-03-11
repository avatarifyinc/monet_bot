export type PopupProps = {
  modelValue: boolean;

  message?: string;
};

export type PopupEmits = {
  (event: 'update:modelValue', value: boolean): void;
};

export const PopupDefaultProps = {
  modelValue: false,
  message: '',
} as const;
