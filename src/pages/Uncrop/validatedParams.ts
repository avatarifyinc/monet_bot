const defaultToStyle = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
  ratio: 1,
};

const _default = {
  img: defaultToStyle,
  active: 'Default',
  rotated: false,
};

const supportedActive = [
  'Default',
  '1:1',
  '4:5',
  '3:4',
  '2:3',
  '9:16',
  'iPhone',
  'iPhone',
  'Tiktok',
  'Instagram',
  'Story',
  '4x6"',
  '5x7"',
  '8x10"',
  'Letter',
];

function validatedImage(params: { img?: unknown }): typeof defaultToStyle {
  if ('img' in params && params.img && typeof params.img === 'object') {
    const _img = params.img;

    const _left =
      'left' in _img && typeof _img.left === 'number' ? _img.left : 0;
    const _top = 'top' in _img && typeof _img.top === 'number' ? _img.top : 0;
    const _width =
      'width' in _img && typeof _img.width === 'number' ? _img.width : 0;
    const _height =
      'height' in _img && typeof _img.height === 'number' ? _img.height : 0;
    const _ratio =
      'ratio' in _img && typeof _img.ratio === 'number' ? _img.ratio : 0;

    return {
      left: _left,
      top: _top,
      width: _width,
      height: _height,
      ratio: _ratio,
    };
  }

  return _default.img;
}

export function validatedParams(params: string | null) {
  if (!params) {
    return _default;
  }

  try {
    const parsed = JSON.parse(params) as unknown;

    if (parsed && typeof parsed === 'object') {
      const _active =
        'active' in parsed &&
        typeof parsed.active === 'string' &&
        supportedActive.includes(parsed.active)
          ? parsed.active
          : 'Default';

      const _rotated = 'rotated' in parsed && parsed.rotated === true;

      const _img = validatedImage(parsed);

      return {
        active: _active,
        rotated: _rotated,
        img: _img,
      };
    } else {
      return _default;
    }
  } catch (e) {
    return _default;
  }
}
