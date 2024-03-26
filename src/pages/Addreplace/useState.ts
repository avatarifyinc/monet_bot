import { ref } from 'vue';

const stack = ref<ImageData[]>([]);
const undoIndex = ref(0);

function rleDecode(stream: Uint32Array) {
  const out = [];
  let mcu = 0;
  let symbol = true;
  let midx = 0;
  let oidx = 0;

  for (let i = 0; i < stream.length; i++) {
    for (let s = 0; s < 4; s++) {
      const overflow = stream[i] & (1 << s);

      if (!overflow) {
        while (--mcu >= 0) {
          out[oidx] = symbol ? 1 : 0;
          oidx++;
        }

        mcu = 0;
        symbol = !symbol;
        midx = 0;
      } else {
        midx++;

        if (midx === 4) {
          throw new Error('Corrupted data.');
        }
      }

      const k = (stream[i] >> (s * 7 + 4)) & 0x7f;

      mcu |= k << (7 * midx);
    }
  }

  while (--mcu >= 0) {
    out[oidx] = symbol ? 1 : 0;
    oidx++;
  }

  return out;
}

function rleEncode(stream: number[]) {
  const out = [0];
  let oidx = 0;
  let mcu = 0;
  let midx = 0;
  let symbol = false;

  for (let i = 0; i <= stream.length; i++) {
    if (i < stream.length && !!stream[i] === symbol) {
      mcu++;
    } else {
      for (let s = 0; s < 4; s++) {
        const k = (mcu >> (s * 7)) & 0x7f;

        out[oidx] |= k << (midx * 7 + 4);

        if (++midx === 4) {
          oidx++;
          out[oidx] = 0;
          midx = 0;
        }

        //overflow?
        if (!(mcu > (1 << (7 * (s + 1))) - 1)) {
          break;
        } else {
          out[oidx] |= 1 << midx;
        }
      }

      mcu = 1;
      symbol = !symbol;
    }
  }

  return new Uint32Array(out);
}

export function useState() {
  const setPromptToLs = (id: string, prompt: string) => {
    localStorage.setItem(`__monet-${id}-prompt`, prompt);
  };

  const getPromptFromLs = (id: string) => {
    const a = localStorage.getItem(`__monet-${id}-prompt`);

    return a || '';
  };

  const pushStackToLs = (id: string, index: number) => {
    const a = stack.value;
    const item = a[index - 1];

    // if (item) {
    //   localStorage.setItem(
    //     `__monet-${id}-arm`,
    //     JSON.stringify(Array.from(rleEncode(item.data)))
    //   );

    //   const q = localStorage.getItem(`__monet-${id}-arm`);

    //   if (q) {
    //     try {
    //     } catch (e) {
    //       console.error(e);
    //     }
    //   }
    // }
  };

  return { stack, undoIndex, getPromptFromLs, setPromptToLs, pushStackToLs };
}
