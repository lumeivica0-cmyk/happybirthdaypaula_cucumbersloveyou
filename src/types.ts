// ===== Core shared types for Mists of Wolmoor Hollow =====

export type CharacterId = 'paula' | 'vika' | 'andriy'

export type LocationId =
  | 'office'
  | 'library'
  | 'clockworkshop'
  | 'secretpassage'

export type Direction = 'up' | 'down' | 'left' | 'right'

export interface Vec2 {
  x: number
  y: number
}

export interface EvidenceItem {
  id: string
  title: string
  description: string
  // extra flavor/analysis text unlocked once the player has examined it in the journal
  analysis?: string
  icon: EvidenceIcon
}

export type EvidenceIcon =
  | 'letter'
  | 'symbol'
  | 'key'
  | 'gear'
  | 'photo'
  | 'note'
  | 'book'
  | 'coin'

export interface InventoryItem {
  id: string
  title: string
  description: string
  icon: EvidenceIcon
}

export interface DialogueLine {
  speaker: CharacterId | 'unknown'
  text: string
}

export interface DialogueScript {
  id: string
  lines: DialogueLine[]
}

export interface Hotspot {
  id: string
  x: number
  y: number
  w: number
  h: number
  label: string
  // what happens on interact — resolved in GameCanvas/useGameState
  kind: 'evidence' | 'item' | 'dialogue' | 'puzzle' | 'exit' | 'npc'
  targetId?: string // evidenceId / itemId / dialogueId / puzzleId / locationId
  // condition: hotspot only appears/interactable if this flag is set (or absent)
  requiresFlag?: string
  // condition: hotspot is hidden once this flag is set (e.g. after solving)
  hideIfFlag?: string
  spawn?: Vec2 // where the player lands if this is an exit
}

export interface GameLocation {
  id: LocationId
  name: string
  subtitle: string
  width: number
  height: number
  // walkable bounds are the full canvas minus wall margins; obstacles below add more
  obstacles: { x: number; y: number; w: number; h: number }[]
  hotspots: Hotspot[]
  ambience: string
}

export interface GameFlags {
  [flag: string]: boolean
}

export interface GameState {
  location: LocationId
  playerPos: Vec2
  facing: Direction
  inventory: InventoryItem[]
  evidence: EvidenceItem[]
  readEvidenceIds: string[]
  flags: GameFlags
  startedAt: number
  endingReached: boolean
}
