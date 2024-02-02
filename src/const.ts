import { TRatio, TStyle } from "./types"

export const RATIOS_TITLED: {
  value: TRatio,
  title: string
}[] = [
  { value: [16,9], title: 'Widescreen • 16:9' },
  { value: [9,16], title: 'Vertical • 9:16' },
  { value: [1,1], title: 'Square • 1:1' },
  { value: [4,3], title: 'Photo • 4:3' },
  { value: [4,5], title: 'Portrait • 4:5' },
  { value: [3,2], title: 'Landscape • 3:2' },
  { value: [21,9], title: 'Cinematic • 21:9' },
]

export const RATIOS = [[16,9], [9,16], [1,1], [4,3], [4,5], [3,2], [21,9]] as const

export const STYLES = ['no style', 'anime', 'photographic', 'digital art', 'comic book', 'fantasy art', 'analog film', 'neon punk', 'isometric', 'low poly', 'origami', 'line art', 'cinematic', '3d model', 'pixel art'] as const


export const STYLES_TITLED: {
  value: TStyle,
  title: string
}[] = [
  { value: 'no style', title: 'No style' },
  { value: 'anime', title: 'Anime' },
  { value: 'photographic', title: 'Photographic' },
  { value: 'digital art', title: 'Digital art' },
  { value: 'comic book', title: 'Comic Book' },
  { value: 'fantasy art', title: 'Fantasy Art' },
  { value: 'analog film', title: 'Analog Film' },
  { value: 'neon punk', title: 'Neon Punk' },
  { value: 'isometric', title: 'Isometric' },
  { value: 'low poly', title: 'Low Poly' },
  { value: 'origami', title: 'Origami' },
  { value: 'line art', title: 'Line Art' },
  { value: 'cinematic', title: 'Cinematic' },
  { value: '3d model', title: '3D Model' },
  { value: 'pixel art', title: 'Pixel Art' },
]
