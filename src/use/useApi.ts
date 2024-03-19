import { useFetch } from '@/http/useFetch';
import { useTelegramSdk } from '@/telegram/use/sdk';

export const costumesStub = [
  {
    name: 'Stylish Haircut',
    imageURL: '',
    preset: 'haircut',
    isPremium: false,
  },
  {
    name: 'Sport',
    imageURL: '',
    preset: 'bodybuilder',
    isPremium: false,
  },
  {
    name: 'Business',
    imageURL: '',
    preset: 'business_suit',
    isPremium: false,
  },
  {
    name: 'BDSM',
    imageURL: '',
    preset: 'bdsm',
    isPremium: false,
  },
  {
    name: 'Superman Underwear',
    imageURL: '',
    preset: 'superman_underwear',
    isPremium: false,
  },
  {
    name: 'Sexy',
    imageURL: '',
    preset: 'sexy',
    isPremium: true,
  },
  {
    name: 'Latex',
    imageURL: '',
    preset: 'latex',
    isPremium: true,
  },
];

export type DTOOutfitItem = {
  name: string;
  imageURL: string;
  preset: string;
  isPremium: boolean;
};

export type DTOOutfits = {
  costumes: DTOOutfitItem[];
};

export function useApi() {
  const sdk = useTelegramSdk();

  const beforeHeaders = () => {
    return {
      'X-TG-INIT-DATA': sdk.initData,
    };
  };

  const loadOutfits = useFetch<DTOOutfits>(
    '/api/v1/outfits',
    'GET',
    beforeHeaders
  );

  const sendOutfit = useFetch<
    void,
    { generation_id: string; preset: string; name: string }
  >('/api/v1/outfits', 'POST', beforeHeaders);

  const txt2img = useFetch<void, { text: string }>(
    '/api/v1/text-to-image',
    'POST',
    beforeHeaders
  );

  const upscale = useFetch<void, { generation_id: string }>(
    '/api/v1/upscale',
    'POST',
    beforeHeaders
  );

  return {
    loadOutfits,
    sendOutfit,

    txt2img,

    upscale,
  };
}
