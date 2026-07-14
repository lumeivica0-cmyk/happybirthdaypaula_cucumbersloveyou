import { useMemo, useState } from 'react'

const SYMBOLS: { id: string; glyph: string; label: string }[] = [
  { id: 'hourglass', glyph: '⏳', label: 'Пісочний годинник' },
  { id: 'raven', glyph: '🐦', label: 'Ворон' },
  { id: 'key', glyph: '🗝', label: 'Ключ' },
  { id: 'eye', glyph: '👁', label: 'Око' },
  { id: 'moon', glyph: '☾', label: 'Місяць' },
  { id: 'star', glyph: '✦', label: 'Зірка' },
]

const SOLUTION = ['hourglass', 'raven', 'key', 'eye', 'moon', 'star']

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function LibraryCipherPuzzle({
  onSolve,
  onClose,
}: {
  onSolve: () => void
  onClose: () => void
}) {
  const tiles = useMemo(() => shuffled(SYMBOLS), [])
  const [chosen, setChosen] = useState<string[]>([])
  const [shake, setShake] = useState(false)
  const [solved, setSolved] = useState(false)

  function pick(id: string) {
    if (solved) return
    const next = [...chosen, id]
    setChosen(next)
    if (next.length === SOLUTION.length) {
      const correct = next.every((v, i) => v === SOLUTION[i])
      if (correct) {
        setSolved(true)
        setTimeout(onSolve, 900)
      } else {
        setShake(true)
        setTimeout(() => {
          setShake(false)
          setChosen([])
        }, 550)
      }
    }
  }

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel puzzle-panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h2>Шафа-шифр</h2>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>
        <p className="puzzle-instructions">
          Натисніть символи на корінцях книг у порядку, в якому того вечора запалювали свічки.
          Підказку шукайте в журналі доказів.
        </p>
        <div className={'cipher-sequence' + (shake ? ' shake' : '')}>
          {SOLUTION.map((_, i) => (
            <div key={i} className={'cipher-slot' + (chosen[i] ? ' filled' : '')}>
              {chosen[i] ? SYMBOLS.find((s) => s.id === chosen[i])?.glyph : ''}
            </div>
          ))}
        </div>
        <div className="cipher-grid">
          {tiles.map((t) => (
            <button
              key={t.id}
              className="cipher-tile"
              disabled={solved}
              onClick={() => pick(t.id)}
              title={t.label}
            >
              {t.glyph}
            </button>
          ))}
        </div>
        {solved && <div className="puzzle-success">Полиця клацнула та зрушила з місця...</div>}
      </div>
    </div>
  )
}
