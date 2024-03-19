import { getCurrentScope, onBeforeUnmount } from 'vue';

import { useApiEndpointResolver } from './useApiEndpointResolver';

type Fn = () => void;

export function tryOnBeforeUnmount(fn: Fn) {
  if (getCurrentScope()) {
    onBeforeUnmount(fn);
  }
}

export function useFetch<
  TResponse,
  TRequest extends object | null | undefined = undefined
>(
  url: string | ((d: TRequest) => string),
  method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE',
  onBeforeHeaders?: () => Record<string, string | undefined>,
  onAbort?: () => void,
  abortable = true,
  bodyFormat?: (d: TRequest) => any
) {
  const apiEndpoint = useApiEndpointResolver();

  let oldController: AbortController | null = null;

  const abort = () => {
    if (oldController && abortable) {
      oldController.abort();

      oldController = null;
    }
  };

  const execute = (data?: TRequest): Promise<TResponse | null> => {
    const controller = new AbortController();

    if (oldController && abortable) {
      oldController.abort();
    }

    oldController = controller;

    const body =
      typeof data === 'object' && data !== null
        ? typeof bodyFormat === 'function'
          ? bodyFormat(data)
          : JSON.stringify(data)
        : (data as null | undefined);

    const truethful = typeof url === 'string' ? url : url(data as any);

    return fetch(`${apiEndpoint}${truethful}`, {
      method: method,
      headers: {
        Accept: 'application/json',
        ...(body instanceof FormData
          ? {}
          : { 'Content-Type': 'application/json' }),
        ...(onBeforeHeaders?.() || {}),
      },
      body: method === 'GET' ? undefined : body,
      signal: controller.signal,
    })
      .then((response) => {
        if (oldController) {
          oldController = null;
        }

        return response;
      })
      .then((response) => {
        if (response.ok || `${response.status}`.startsWith('2')) {
          return response.json().catch(() => undefined);
        }

        return Promise.reject(response);
      })
      .catch((error: Response) => {
        if (
          (oldController && oldController.signal.aborted) ||
          (error as any).name === 'AbortError'
        ) {
          onAbort?.();

          return null;
        }

        const status = error.status;

        return error && error.json
          ? error
              .json()
              .catch(() => Promise.reject(['Error', status]))
              .then((errorData) => Promise.reject([errorData, status]))
          : Promise.reject(['Network Error', 400]);
      });
  };

  tryOnBeforeUnmount(abort);

  return {
    abort,
    execute,
  };
}
