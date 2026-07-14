import { useCallback, useEffect, useRef, useState } from 'react'
import type { GameState, LocationId, Vec2, Direction } from '../types'
import { EVIDENCE, ITEMS } from '../data/content'

const SAVE_KEY = 'wolmoor-hollow-save-v1'

function freshState(): GameState {
  return {
    location: 'office',
    playerPos: { x: 450, y: 460 },
    facing: 'down',
    inventory: [],
    evidence: [],
    readEvidenceIds: [],
    flags: {},
    startedAt: Date.now(),
    endingReached: false,
  }
}

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return freshState()
    const parsed = JSON.parse(raw) as GameState
    if (!parsed.location || !parsed.playerPos) return freshState()
    return parsed
  } catch {
    return freshState()
  }
}

export function useGameState() {
  const [state, setState] = useState<GameState>(loadState)
  const saveTimer = useRef<number | null>(null)

  useEffect(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(state))
      } catch {
        // storage unavailable — ignore, game still playable this session
      }
    }, 250)
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
    }
  }, [state])

  const movePlayerTo = useCallback((pos: Vec2, facing: Direction) => {
    setState((s) => ({ ...s, playerPos: pos, facing }))
  }, [])

  const changeLocation = useCallback((loc: LocationId, spawn: Vec2) => {
    setState((s) => ({ ...s, location: loc, playerPos: spawn }))
  }, [])

  const collectEvidence = useCallback((evidenceId: string) => {
    setState((s) => {
      if (s.evidence.find((e) => e.id === evidenceId)) return s
      const item = EVIDENCE[evidenceId]
      if (!item) return s
      return { ...s, evidence: [...s.evidence, item] }
    })
  }, [])

  const collectItem = useCallback((itemId: string) => {
    setState((s) => {
      if (s.inventory.find((i) => i.id === itemId)) return s
      const item = ITEMS[itemId]
      if (!item) return s
      return { ...s, inventory: [...s.inventory, item] }
    })
  }, [])

  const setFlag = useCallback((flag: string, value = true) => {
    setState((s) => ({ ...s, flags: { ...s.flags, [flag]: value } }))
  }, [])

  const hasFlag = useCallback((flag: string) => !!state.flags[flag], [state.flags])

  const markEvidenceRead = useCallback((evidenceId: string) => {
    setState((s) =>
      s.readEvidenceIds.includes(evidenceId)
        ? s
        : { ...s, readEvidenceIds: [...s.readEvidenceIds, evidenceId] },
    )
  }, [])

  const reachEnding = useCallback(() => {
    setState((s) => ({ ...s, endingReached: true }))
  }, [])

  const resetGame = useCallback(() => {
    const fresh = freshState()
    setState(fresh)
    try {
      localStorage.removeItem(SAVE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  return {
    state,
    movePlayerTo,
    changeLocation,
    collectEvidence,
    collectItem,
    setFlag,
    hasFlag,
    markEvidenceRead,
    reachEnding,
    resetGame,
  }
}

export type UseGameState = ReturnType<typeof useGameState>
