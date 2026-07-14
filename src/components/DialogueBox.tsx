import { useState } from 'react'
import type { DialogueScript, CharacterId } from '../types'
import Avatar from './Avatar'

const NAMES: Record<string, string> = {
  paula: 'Паула',
  vika: 'Віка',
  andriy: 'Андрій',
  unknown: '???',
}

export default function DialogueBox({
  script,
  onDone,
}: {
  script: DialogueScript
  onDone: () => void
}) {
  const [idx, setIdx] = useState(0)
  const line = script.lines[idx]

  function next() {
    if (idx + 1 >= script.lines.length) {
      onDone()
    } else {
      setIdx(idx + 1)
    }
  }

  return (
    <div className="dialogue-overlay" onClick={next}>
      <div className="dialogue-box" onClick={(e) => e.stopPropagation()}>
        <div className="dialogue-avatar">
          <Avatar character={line.speaker === 'unknown' ? 'andriy' : (line.speaker as CharacterId)} size={64} />
        </div>
        <div className="dialogue-content">
          <div className="dialogue-name">{NAMES[line.speaker]}</div>
          <div className="dialogue-text">{line.text}</div>
          <button className="dialogue-next" onClick={next}>
            {idx + 1 >= script.lines.length ? 'Закрити' : 'Далі ▸'}
          </button>
        </div>
      </div>
    </div>
  )
}
