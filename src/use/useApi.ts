import { useFetch } from '@/http/useFetch';
import { useTelegramSdk } from '@/telegram/use/sdk';

export function useApi() {
  const sdk = useTelegramSdk();

  const beforeHeaders = () => {
    return {
      'X-TG-INIT-DATA': sdk.initData,
    };
  };

  const loadOutfits = useFetch('/api/v1/outfits', 'GET', beforeHeaders);

  return {
    loadOutfits,
  };
}
