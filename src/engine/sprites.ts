import type { CharacterId, Direction } from '../types'

// ===== Procedural pixel-art renderer =====
// Every character is drawn as layered blocky rectangles snapped to a pixel
// grid (unit = 4 canvas px before scaling). No external image assets are
// used, so the whole game runs from pure code — but the result still reads
// as a cohesive pixel-art indie-game cast. Swap this module out later for
// real spritesheets if you ever want to.

interface CharacterPalette {
  hair: string
  hairShadow: string
  skin: string
  skinShadow: string
  outfitPrimary: string
  outfitPrimaryShadow: string
  outfitSecondary: string
  outfitSecondaryShadow: string
  accent: string
  shoe: string
}

export const PALETTES: Record<CharacterId, CharacterPalette> = {
  paula: {
    hair: '#3b2417',
    hairShadow: '#2a1810',
    skin: '#f3d5b6',
    skinShadow: '#dbb48f',
    outfitPrimary: '#5c1620', // dark red lace corset
    outfitPrimaryShadow: '#3f0f16',
    outfitSecondary: '#f6f2e9', // white short skirt
    outfitSecondaryShadow: '#dcd6c6',
    accent: '#c9a86a', // necklace + bag strap
    shoe: '#241a14',
  },
  vika: {
    hair: '#8a7355',
    hairShadow: '#665640',
    skin: '#f4d9bc',
    skinShadow: '#dcb896',
    outfitPrimary: '#a9c9d9', // light blue striped shirt
    outfitPrimaryShadow: '#7fa2b4',
    outfitSecondary: '#f5f2ea', // white high-waist pants
    outfitSecondaryShadow: '#dad4c4',
    accent: '#c7c7cf', // silver earrings
    shoe: '#3a3a3f',
  },
  andriy: {
    hair: '#4a2f1d',
    hairShadow: '#331f13',
    skin: '#f0d2b0',
    skinShadow: '#d6ae88',
    outfitPrimary: '#1c1c1c', // black fleece zip hoodie
    outfitPrimaryShadow: '#0c0c0c',
    outfitSecondary: '#111111', // black pants
    outfitSecondaryShadow: '#000000',
    accent: '#4b4b4b', // zipper
    shoe: '#000000',
  },
}

const U = 4 // base pixel unit

function px(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color
  ctx.fillRect(Math.round(x), Math.round(y), w, h)
}

export function drawCharacter(
  ctx: CanvasRenderingContext2D,
  character: CharacterId,
  originX: number,
  originY: number, // feet position (bottom center)
  scale: number,
  walking: boolean,
  frame: number, // increments over time for animation
  dir: Direction,
) {
  const p = PALETTES[character]
  const s = scale
  const bob = walking ? (frame % 2 === 0 ? 0 : -1 * s) : 0
  const stepOffset = walking ? (frame % 2 === 0 ? 1 : -1) * s : 0
  const facingBack = dir === 'up'
  const mirror = dir === 'left'

  ctx.save()
  ctx.translate(originX, originY)
  if (mirror) ctx.scale(-1, 1)

  const w = U * s
  const bodyW = 7 * w
  const left = -bodyW / 2

  // ----- shadow on ground -----
  ctx.save()
  ctx.globalAlpha = 0.28
  ctx.fillStyle = '#000000'
  ctx.beginPath()
  ctx.ellipse(0, 2, bodyW * 0.55, w * 0.9, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  const bodyTop = -22 * w + bob
  const legTop = -9 * w + bob

  // ----- legs / shoes (behind torso baseline) -----
  const legColor = character === 'paula' ? p.skin : p.outfitSecondary
  const legShadow = character === 'paula' ? p.skinShadow : p.outfitSecondaryShadow
  px(ctx, left + 1 * w, legTop + stepOffset, 2 * w, 8 * w, legColor)
  px(ctx, left + 4 * w, legTop - stepOffset, 2 * w, 8 * w, legColor)
  px(ctx, left + 1 * w, legTop + stepOffset + 6 * w, 2 * w, 1.5 * w, legShadow)
  px(ctx, left + 4 * w, legTop - stepOffset + 6 * w, 2 * w, 1.5 * w, legShadow)
  // shoes
  px(ctx, left + 0.6 * w, legTop + stepOffset + 7 * w, 2.8 * w, 1.6 * w, p.shoe)
  px(ctx, left + 3.6 * w, legTop - stepOffset + 7 * w, 2.8 * w, 1.6 * w, p.shoe)

  // ----- skirt (Paula only) drawn over top of legs -----
  if (character === 'paula') {
    px(ctx, left + 0.5 * w, legTop - 2 * w, 6 * w, 3.2 * w, p.outfitSecondary)
    px(ctx, left + 0.5 * w, legTop + 0.6 * w, 6 * w, 0.8 * w, p.outfitSecondaryShadow)
  }

  // ----- torso -----
  px(ctx, left + 0.5 * w, bodyTop + 9 * w, 6 * w, 6 * w, p.outfitPrimary)
  px(ctx, left + 0.5 * w, bodyTop + 13.5 * w, 6 * w, 1.5 * w, p.outfitPrimaryShadow)

  // outfit details
  if (character === 'vika') {
    // horizontal stripes on shirt
    px(ctx, left + 0.5 * w, bodyTop + 10 * w, 6 * w, 0.7 * w, p.outfitSecondaryShadow)
    px(ctx, left + 0.5 * w, bodyTop + 11.5 * w, 6 * w, 0.7 * w, p.outfitSecondaryShadow)
    px(ctx, left + 0.5 * w, bodyTop + 13 * w, 6 * w, 0.7 * w, p.outfitSecondaryShadow)
    // pants visible below shirt
    px(ctx, left + 0.8 * w, legTop - 1.5 * w, 5.4 * w, 2.6 * w, p.outfitSecondary)
  }
  if (character === 'andriy') {
    // zipper line
    px(ctx, left + 3.4 * w, bodyTop + 9 * w, 0.5 * w, 6 * w, p.accent)
  }
  if (character === 'paula') {
    // necklace + bag strap
    px(ctx, left + 2.6 * w, bodyTop + 9.2 * w, 1.8 * w, 0.5 * w, p.accent)
    if (!facingBack) {
      px(ctx, left - 0.6 * w, bodyTop + 9 * w, 1 * w, 6.5 * w, '#1c1c1c')
      px(ctx, left - 0.9 * w, bodyTop + 14 * w, 1.8 * w, 2 * w, '#1c1c1c')
    }
  }

  // ----- arms -----
  const armSwing = walking ? stepOffset * 0.6 : 0
  px(ctx, left - 0.4 * w, bodyTop + 9.5 * w + armSwing, 1 * w, 4.5 * w, p.outfitPrimary)
  px(ctx, left + 6.4 * w, bodyTop + 9.5 * w - armSwing, 1 * w, 4.5 * w, p.outfitPrimary)
  px(ctx, left - 0.4 * w, bodyTop + 13.5 * w + armSwing, 1 * w, 1 * w, p.skin)
  px(ctx, left + 6.4 * w, bodyTop + 13.5 * w - armSwing, 1 * w, 1 * w, p.skin)

  // ----- neck -----
  px(ctx, left + 2.5 * w, bodyTop + 7.5 * w, 2 * w, 1.5 * w, p.skinShadow)

  // ----- head -----
  const headTop = bodyTop
  if (facingBack) {
    // back of head: solid hair block, no face
    px(ctx, left + 0.8 * w, headTop, 5.4 * w, 7.5 * w, p.hair)
    px(ctx, left + 0.8 * w, headTop + 6 * w, 5.4 * w, 1.5 * w, p.hairShadow)
    if (character === 'paula' || character === 'vika') {
      // long hair extends further down the back
      px(ctx, left + 1 * w, headTop + 7 * w, 5 * w, 3.5 * w, p.hair)
    }
  } else {
    // side hair (behind face)
    if (character === 'paula' || character === 'vika') {
      px(ctx, left + 0.6 * w, headTop + 2 * w, 1.4 * w, 9 * w, p.hair)
      px(ctx, left + 6 * w, headTop + 2 * w, 1.4 * w, 9 * w, p.hair)
    }
    // face
    px(ctx, left + 1.5 * w, headTop + 2 * w, 4 * w, 5 * w, p.skin)
    px(ctx, left + 1.5 * w, headTop + 6 * w, 4 * w, 0.8 * w, p.skinShadow)
    // eyes
    px(ctx, left + 2.2 * w, headTop + 4 * w, 0.7 * w, 0.9 * w, '#241a14')
    px(ctx, left + 4.3 * w, headTop + 4 * w, 0.7 * w, 0.9 * w, '#241a14')
    // hair top / bangs
    px(ctx, left + 0.8 * w, headTop, 5.4 * w, 2.2 * w, p.hair)
    if (character === 'andriy') {
      px(ctx, left + 1.2 * w, headTop + 1.6 * w, 4.6 * w, 1 * w, p.hair)
    } else {
      px(ctx, left + 1.3 * w, headTop + 1.8 * w, 1.4 * w, 1.2 * w, p.hair)
      px(ctx, left + 4.5 * w, headTop + 1.8 * w, 1.4 * w, 1.2 * w, p.hair)
    }
    if (character === 'vika') {
      // small silver earring
      px(ctx, left + 1.0 * w, headTop + 6.6 * w, 0.6 * w, 0.6 * w, p.accent)
    }
  }

  ctx.restore()
}

export function drawNpcMarker(ctx: CanvasRenderingContext2D, character: CharacterId, x: number, y: number, scale: number) {
  drawCharacter(ctx, character, x, y, scale, false, 0, 'down')
}
