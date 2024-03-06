import { InjectionKey, Ref } from 'vue';

export const SUBMIT_STATE = Symbol() as InjectionKey<
  Ref<
    | (Record<string, unknown> & {
        webserver_url?: string;
      })
    | null
  >
>;
