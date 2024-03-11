import { InjectionKey, Ref } from 'vue';

export const SUBMIT_STATE = Symbol() as InjectionKey<
  Ref<Record<string, unknown> | null>
>;

type PopupsHostInstance = {
  setOpened: (id: string, value: boolean) => void;
  remove: (id: string) => void;
};

export const POPUPS_HOST_TOKEN = Symbol() as InjectionKey<
  Ref<PopupsHostInstance | null>
>;
