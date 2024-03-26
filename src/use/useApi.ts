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

export type DTOSettings = {
  style: 'no style';
  aspect_ratio: number[];
  negative_prompt: string | null;
};

export type DTOUncrop = {
  generation_id: string;
  canvas_width: number;
  canvas_height: number;
  image_x: number;
  image_y: number;
  image_height: number;
  image_width: number;
};

export function useApi() {
  const sdk = useTelegramSdk();

  const beforeHeaders = () => {
    return {
      'X-TG-INIT-DATA': sdk.initData,
    };
  };

  const loadOutfits = useFetch<DTOOutfits>(
    '/api/v1/configs/outfits',
    'GET',
    beforeHeaders
  );

  const sendOutfit = useFetch<
    void,
    { generation_id: string; preset: string; name: string }
  >('/api/v1/generation/outfits', 'POST', beforeHeaders);

  const txt2img = useFetch(
    '/api/v1/generation/text-to-image',
    'POST',
    beforeHeaders
  );

  const upscale = useFetch<void, { generation_id: string }>(
    '/api/v1/generation/upscale',
    'POST',
    beforeHeaders
  );

  const eraser = useFetch<
    void,
    {
      original_image_id: string;
      masked_image: Blob;
    }
  >(
    (request) => {
      const q = new URLSearchParams();

      Object.keys(request).forEach((key) => {
        if (key !== 'masked_image') {
          q.set(key, `${(request as any)[key]}`);
        }
      });

      return `/api/v1/generation/eraser?${q.toString()}`;
    },
    'POST',
    beforeHeaders,
    undefined,
    true,
    (request) => {
      const fd = new FormData();

      fd.set('masked_image', request.masked_image);

      return fd;
    }
  );

  const addReplace = useFetch<
    void,
    {
      original_image_id: string;
      negative_prompt: string;
      prompt: string;
      masked_image: Blob;
      image_strength: number;
      force_insert: boolean;
    }
  >(
    (request) => {
      const q = new URLSearchParams();

      Object.keys(request).forEach((key) => {
        if (key !== 'masked_image') {
          q.set(key, `${(request as any)[key]}`);
        }
      });

      return `/api/v1/generation/add-replace?${q.toString()}`;
    },
    'POST',
    beforeHeaders,
    undefined,
    true,
    (request) => {
      const fd = new FormData();

      fd.set('masked_image', request.masked_image);

      return fd;
    }
  );

  const loadSettings = useFetch<DTOSettings>(
    '/api/v1/settings/',
    'GET',
    beforeHeaders
  );

  const saveSettings = useFetch<void, DTOSettings>(
    '/api/v1/settings/',
    'PUT',
    beforeHeaders
  );

  const uncrop = useFetch<void, DTOUncrop>(
    '/api/v1/generation/uncrop',
    'POST',
    beforeHeaders
  );

  const refreshUrl = useFetch<
    { generation_id: string | null; url: string | null },
    { generation_id: string }
  >('/api/v1/refresh-url/', 'POST', beforeHeaders);

  return {
    loadOutfits,
    sendOutfit,

    loadSettings,
    saveSettings,

    refreshUrl,

    txt2img,

    upscale,

    addReplace,

    eraser,

    uncrop,
  };
}
