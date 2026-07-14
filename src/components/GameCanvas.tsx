import { useEffect, useRef, useState } from 'react'
import type { GameLocation, Hotspot, Vec2, Direction, CharacterId } from '../types'
import { drawCharacter } from '../engine/sprites'

interface Props {
  location: GameLocation
  playerPos: Vec2
  facing: Direction
  onMove: (pos: Vec2, facing: Direction) => void
  onInteract: (hotspot: Hotspot) => void
  isFlagSet: (flag: string) => boolean
  npcs?: { id: CharacterId; pos: Vec2 }[]
  paused: boolean
}

const PLAYER_RADIUS = 16
const SPEED = 220 // px/sec
const INTERACT_RANGE = 95

function rectsOverlap(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number,
) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by
}

export default function GameCanvas({
  location, playerPos, facing, onMove, onInteract, isFlagSet, npcs = [], paused,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const keysRef = useRef<Record<string, boolean>>({})
  const posRef = useRef<Vec2>(playerPos)
  const facingRef = useRef<Direction>(facing)
  const frameRef = useRef(0)
  const walkTickRef = useRef(0)
  const [nearHotspot, setNearHotspot] = useState<Hotspot | null>(null)
  const rafRef = useRef<number>(0)
  const lastTsRef = useRef<number>(0)

  // reset local position when the location (or an external teleport) changes
  useEffect(() => {
    posRef.current = playerPos
    facingRef.current = facing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.id])

  const visibleHotspots = location.hotspots.filter((h) => {
    if (h.requiresFlag && !isFlagSet(h.requiresFlag)) return false
    if (h.hideIfFlag && isFlagSet(h.hideIfFlag)) return false
    return true
  })

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      keysRef.current[key] = true
      if (key === 'e' && nearHotspot && !paused) {
        onInteract(nearHotspot)
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false
    }
    const onWindowBlur = () => {
      keysRef.current = {}
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onWindowBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onWindowBlur)
    }
  }, [nearHotspot, onInteract, paused])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    function drawGlow(x: number, y: number, r: number, color: string) {
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
      grad.addColorStop(0, color)
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grad
      ctx.fillRect(x - r, y - r, r * 2, r * 2)
    }

    function step(ts: number) {
      if (!lastTsRef.current) lastTsRef.current = ts
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05)
      lastTsRef.current = ts

      if (!paused) {
        const k = keysRef.current
        let dx = 0
        let dy = 0
        if (k['arrowup'] || k['w']) dy -= 1
        if (k['arrowdown'] || k['s']) dy += 1
        if (k['arrowleft'] || k['a']) dx -= 1
        if (k['arrowright'] || k['d']) dx += 1

        const moving = dx !== 0 || dy !== 0
        if (moving) {
          const len = Math.hypot(dx, dy) || 1
          dx = (dx / len) * SPEED * dt
          dy = (dy / len) * SPEED * dt

          if (Math.abs(dx) > Math.abs(dy)) {
            facingRef.current = dx > 0 ? 'right' : 'left'
          } else {
            facingRef.current = dy > 0 ? 'down' : 'up'
          }

          const next = { x: posRef.current.x + dx, y: posRef.current.y + dy }
          next.x = Math.max(PLAYER_RADIUS, Math.min(location.width - PLAYER_RADIUS, next.x))
          next.y = Math.max(PLAYER_RADIUS + 40, Math.min(location.height - PLAYER_RADIUS, next.y))

          const blocked = location.obstacles.some((o) =>
            rectsOverlap(
              next.x - PLAYER_RADIUS, next.y - PLAYER_RADIUS * 0.6, PLAYER_RADIUS * 2, PLAYER_RADIUS * 1.2,
              o.x, o.y, o.w, o.h,
            ),
          )
          if (!blocked) {
            posRef.current = next
          }
          walkTickRef.current += dt
          if (walkTickRef.current > 0.14) {
            walkTickRef.current = 0
            frameRef.current = (frameRef.current + 1) % 2
          }
        }

        // find nearest interactable hotspot
        let closest: Hotspot | null = null
        let closestDist = Infinity
        for (const h of visibleHotspots) {
          const hx = h.x + h.w / 2
          const hy = h.y + h.h / 2
          const d = Math.hypot(posRef.current.x - hx, posRef.current.y - hy)
          if (d < INTERACT_RANGE && d < closestDist) {
            closest = h
            closestDist = d
          }
        }
        setNearHotspot((prev) => (prev?.id === closest?.id ? prev : closest))

        onMove(posRef.current, facingRef.current)
      }

      if (ctx) {
        render(ctx)
      }
      rafRef.current = requestAnimationFrame(step)
    }

    function render(ctx: CanvasRenderingContext2D) {
      const { width, height } = location
      ctx.clearRect(0, 0, width, height)

      // ambient glow sources
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      drawGlow(width * 0.18, 80, 120, 'rgba(255,210,140,0.18)')
      drawGlow(width * 0.82, 68, 100, 'rgba(122,190,255,0.14)')
      drawGlow(width * 0.5, 120, 90, 'rgba(179,134,85,0.1)')
      ctx.restore()

      // floor
      const grad = ctx.createLinearGradient(0, 0, 0, height)
      grad.addColorStop(0, '#141a24')
      grad.addColorStop(0.35, '#16202a')
      grad.addColorStop(1, '#1c2330')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)

      // textured floor grid
      ctx.save()
      ctx.strokeStyle = 'rgba(201,168,106,0.05)'
      ctx.lineWidth = 1
      for (let gx = 0; gx < width; gx += 40) {
        ctx.beginPath()
        ctx.moveTo(gx, 40)
        ctx.lineTo(gx, height)
        ctx.stroke()
      }
      for (let gy = 40; gy < height; gy += 40) {
        ctx.beginPath()
        ctx.moveTo(0, gy)
        ctx.lineTo(width, gy)
        ctx.stroke()
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.04)'
      ctx.lineWidth = 0.7
      for (let gy = 60; gy < height; gy += 50) {
        ctx.beginPath()
        ctx.moveTo(8, gy)
        ctx.lineTo(width - 12, gy + 2)
        ctx.stroke()
      }
      ctx.restore()

      // subtle floor tiles
      ctx.strokeStyle = 'rgba(201,168,106,0.06)'
      ctx.lineWidth = 1
      for (let gx = 0; gx < width; gx += 40) {
        ctx.beginPath()
        ctx.moveTo(gx, 40)
        ctx.lineTo(gx, height)
        ctx.stroke()
      }
      for (let gy = 40; gy < height; gy += 40) {
        ctx.beginPath()
        ctx.moveTo(0, gy)
        ctx.lineTo(width, gy)
        ctx.stroke()
      }

      // obstacles as furniture blocks
      for (const o of location.obstacles) {
        ctx.fillStyle = '#2b2318'
        ctx.fillRect(o.x, o.y, o.w, o.h)
        ctx.strokeStyle = 'rgba(201,168,106,0.35)'
        ctx.lineWidth = 2
        ctx.strokeRect(o.x + 1, o.y + 1, o.w - 2, o.h - 2)
      }

      // hotspots
      for (const h of visibleHotspots) {
        const cx = h.x + h.w / 2
        const cy = h.y + h.h / 2
        const pulse = 3 + Math.sin(performance.now() / 300 + h.x) * 2
        ctx.save()
        ctx.globalCompositeOperation = 'lighter'
        const glowColor = h.kind === 'puzzle' ? 'rgba(201,168,106,0.18)' : h.kind === 'exit' ? 'rgba(111,147,166,0.12)' : 'rgba(143,174,124,0.14)'
        drawGlow(cx, cy, 28, glowColor)
        ctx.restore()

        ctx.save()
        ctx.globalAlpha = h.id === nearHotspot?.id ? 0.95 : 0.55
        ctx.fillStyle = h.kind === 'puzzle' ? '#c9a86a' : h.kind === 'exit' ? '#6f93a6' : '#8fae7c'
        ctx.beginPath()
        ctx.arc(cx, cy, 6 + pulse * 0.3, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // npcs
      for (const npc of npcs) {
        drawCharacter(ctx, npc.id, npc.pos.x, npc.pos.y, 2.6, false, 0, 'down')
      }

      // player
      drawCharacter(
        ctx,
        'paula',
        posRef.current.x,
        posRef.current.y,
        2.8,
        keysRef.current['w'] || keysRef.current['a'] || keysRef.current['s'] || keysRef.current['d'] ||
          keysRef.current['arrowup'] || keysRef.current['arrowdown'] || keysRef.current['arrowleft'] || keysRef.current['arrowright'],
        frameRef.current,
        facingRef.current,
      )

      // warm edge glow
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      drawGlow(width * 0.15, height * 0.25, 90, 'rgba(255,215,165,0.12)')
      drawGlow(width * 0.85, height * 0.22, 80, 'rgba(120,185,240,0.12)')
      ctx.restore()

      // fog vignette
      const vg = ctx.createRadialGradient(width / 2, height / 2, height / 3, width / 2, height / 2, height)
      vg.addColorStop(0, 'rgba(0,0,0,0)')
      vg.addColorStop(1, 'rgba(0,0,0,0.45)')
      ctx.fillStyle = vg
      ctx.fillRect(0, 0, width, height)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, paused, nearHotspot, npcs])

  return (
    <div className="game-canvas-wrap">
      <canvas
        ref={canvasRef}
        width={location.width}
        height={location.height}
        className="game-canvas"
      />
      {nearHotspot && !paused && (
        <div className="interact-prompt">
          <kbd>E</kbd> {nearHotspot.label}
        </div>
      )}
    </div>
  )
}
