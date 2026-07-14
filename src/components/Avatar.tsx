import { useEffect, useRef } from 'react'
import type { CharacterId } from '../types'
import { drawCharacter } from '../engine/sprites'

export default function Avatar({ character, size = 56 }: { character: CharacterId; size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, c.width, c.height)
    drawCharacter(ctx, character, c.width / 2, c.height - 6, size / 34, false, 0, 'down')
  }, [character, size])
  return <canvas ref={ref} width={size} height={size} className="avatar-canvas" />
}
