import { useEffect, useState } from 'react'
import { useGameState } from './engine/useGameState'
import { LOCATIONS } from './data/locations'
import { DIALOGUES, EVIDENCE, ITEMS } from './data/content'
import type { Hotspot, CharacterId, Vec2, DialogueScript } from './types'
import GameCanvas from './components/GameCanvas'
import HUD from './components/HUD'
import Journal from './components/Journal'
import Inventory from './components/Inventory'
import DialogueBox from './components/DialogueBox'
import PickupToast from './components/PickupToast'
import StartScreen from './components/StartScreen'
import Ending from './components/Ending'
import LibraryCipherPuzzle from './components/puzzles/LibraryCipherPuzzle'
import ClockPuzzle from './components/puzzles/ClockPuzzle'
import ChestLockPuzzle from './components/puzzles/ChestLockPuzzle'

const NPC_POSITIONS: Partial<Record<string, { id: CharacterId; pos: Vec2 }[]>> = {
  office: [
    { id: 'vika', pos: { x: 260, y: 190 } },
    { id: 'andriy', pos: { x: 640, y: 190 } },
  ],
  library: [{ id: 'vika', pos: { x: 200, y: 320 } }],
  clockworkshop: [{ id: 'andriy', pos: { x: 700, y: 320 } }],
  secretpassage: [
    { id: 'vika', pos: { x: 250, y: 480 } },
    { id: 'andriy', pos: { x: 650, y: 480 } },
  ],
}

type Toast = { id: string; title: string; kind: 'evidence' | 'item'; icon: any }

export default function App() {
  const gs = useGameState()
  const { state } = gs

  const [screen, setScreen] = useState<'start' | 'game'>('start')
  const [journalOpen, setJournalOpen] = useState(false)
  const [inventoryOpen, setInventoryOpen] = useState(false)
  const [activeDialogue, setActiveDialogue] = useState<DialogueScript | null>(null)
  const [activePuzzle, setActivePuzzle] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  const hasExistingSave = state.evidence.length > 0 || state.location !== 'office'

  const location = LOCATIONS[state.location]

  // first-visit ambient dialogue per location
  useEffect(() => {
    if (screen !== 'game') return
    const visitedFlag = `visited_${state.location}`
    if (!gs.hasFlag(visitedFlag)) {
      gs.setFlag(visitedFlag)
      const script = DIALOGUES[state.location]
      if (script) {
        setActiveDialogue(script)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.location, screen])

  useEffect(() => {
    if (screen !== 'game') return

    const onKeyDown = (e: KeyboardEvent) => {
      const code = e.code || e.key
      if (code === 'KeyJ' || code === 'j') setJournalOpen(true)
      if (code === 'KeyI' || code === 'i') setInventoryOpen(true)

      if (code === 'Escape' || code === 'Esc' || code === 'Escape') {
        if (activePuzzle) setActivePuzzle(null)
        else if (activeDialogue) setActiveDialogue(null)
        else if (inventoryOpen) setInventoryOpen(false)
        else if (journalOpen) setJournalOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [screen, activeDialogue, activePuzzle, inventoryOpen, journalOpen])

  useEffect(() => {
    if (state.endingReached) return
    if (gs.hasFlag('chest_solved')) {
      const t = setTimeout(() => gs.reachEnding(), 1400)
      return () => clearTimeout(t)
    }
  }, [state.flags, state.endingReached])

  function pushToast(t: Toast) {
    setToasts((cur) => [...cur, t])
  }

  function handleInteract(h: Hotspot) {
    switch (h.kind) {
      case 'evidence': {
        if (!h.targetId) return
        const already = state.evidence.find((e) => e.id === h.targetId)
        gs.collectEvidence(h.targetId)
        if (!already) {
          const item = EVIDENCE[h.targetId]
          if (item) pushToast({ id: item.id, title: item.title, kind: 'evidence', icon: item.icon })
        }
        break
      }
      case 'item': {
        if (!h.targetId) return
        const already = state.inventory.find((i) => i.id === h.targetId)
        gs.collectItem(h.targetId)
        if (!already) {
          const item = ITEMS[h.targetId]
          if (item) pushToast({ id: item.id, title: item.title, kind: 'item', icon: item.icon })
        }
        break
      }
      case 'dialogue': {
        if (!h.targetId) return
        const script = DIALOGUES[h.targetId]
        if (script) setActiveDialogue(script)
        break
      }
      case 'puzzle': {
        if (!h.targetId) return
        setActivePuzzle(h.targetId)
        break
      }
      case 'exit': {
        if (!h.targetId || !h.spawn) return
        gs.changeLocation(h.targetId as any, h.spawn)
        break
      }
    }
  }

  function onPuzzleSolved(puzzleId: string) {
    if (puzzleId === 'libraryCipher') {
      gs.setFlag('library_solved')
      setActivePuzzle(null)
      setActiveDialogue(DIALOGUES.librarySolved)
    } else if (puzzleId === 'clockPuzzle') {
      gs.setFlag('clock_solved')
      setActivePuzzle(null)
      setActiveDialogue(DIALOGUES.clockSolved)
    } else if (puzzleId === 'chestLock') {
      gs.setFlag('chest_solved')
      setActivePuzzle(null)
    }
  }

  const paused = journalOpen || inventoryOpen || !!activeDialogue || !!activePuzzle || state.endingReached

  if (screen === 'start') {
    return (
      <StartScreen
        hasSave={hasExistingSave}
        onContinue={() => setScreen('game')}
        onStart={() => {
          gs.resetGame()
          setScreen('game')
        }}
      />
    )
  }

  if (state.endingReached) {
    return (
      <Ending
        onRestart={() => {
          gs.resetGame()
          setScreen('start')
        }}
      />
    )
  }

  return (
    <div className="app-root">
      <HUD
        locationName={location.name}
        locationSubtitle={location.subtitle}
        evidenceCount={state.evidence.length}
        itemCount={state.inventory.length}
        onOpenJournal={() => setJournalOpen(true)}
        onOpenInventory={() => setInventoryOpen(true)}
      />

      <GameCanvas
        location={location}
        playerPos={state.playerPos}
        facing={state.facing}
        onMove={gs.movePlayerTo}
        onInteract={handleInteract}
        isFlagSet={gs.hasFlag}
        npcs={NPC_POSITIONS[state.location]}
        paused={paused}
      />

      {journalOpen && <Journal evidence={state.evidence} onClose={() => setJournalOpen(false)} />}
      {inventoryOpen && <Inventory items={state.inventory} onClose={() => setInventoryOpen(false)} />}

      {activeDialogue && (
        <DialogueBox script={activeDialogue} onDone={() => setActiveDialogue(null)} />
      )}

      {activePuzzle === 'libraryCipher' && (
        <LibraryCipherPuzzle
          onSolve={() => onPuzzleSolved('libraryCipher')}
          onClose={() => setActivePuzzle(null)}
        />
      )}
      {activePuzzle === 'clockPuzzle' && (
        <ClockPuzzle
          onSolve={() => onPuzzleSolved('clockPuzzle')}
          onClose={() => setActivePuzzle(null)}
        />
      )}
      {activePuzzle === 'chestLock' && (
        <ChestLockPuzzle
          onSolve={() => onPuzzleSolved('chestLock')}
          onClose={() => setActivePuzzle(null)}
        />
      )}

      <div className="toast-stack">
        {toasts.map((t) => (
          <PickupToast
            key={t.id + Math.random()}
            title={t.title}
            kind={t.kind}
            icon={t.icon}
            onDone={() => setToasts((cur) => cur.filter((x) => x !== t))}
          />
        ))}
      </div>
    </div>
  )
}
