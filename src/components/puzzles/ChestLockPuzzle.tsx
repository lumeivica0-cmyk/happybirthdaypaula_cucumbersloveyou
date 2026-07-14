import { useState } from 'react'

// digits derive from: (candles in the order-puzzle) (hour of the grandfather clock) (ravens carved on the wall)
const CODE = [6, 8, 3]

export default function ChestLockPuzzle({
  onSolve,
  onClose,
}: {
  onSolve: () => void
  onClose: () => void
}) {
  const [digits, setDigits] = useState([0, 0, 0])
  const [solved, setSolved] = useState(false)
  const [wrongPulse, setWrongPulse] = useState(false)

  function change(i: number, delta: number) {
    setDigits((d) => {
      const next = [...d]
      next[i] = (next[i] + delta + 10) % 10
      return next
    })
  }

  function submit() {
    if (digits.every((d, i) => d === CODE[i])) {
      setSolved(true)
      setTimeout(onSolve, 1200)
    } else {
      setWrongPulse(true)
      setTimeout(() => setWrongPulse(false), 500)
    }
  }

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel puzzle-panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h2>Скриня з потрійним замком</h2>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>
        <p className="puzzle-instructions">
          Три числа відкриють правду. Перегляньте докази в журналі, щоб зібрати їх усі.
        </p>
        <div className={'lock-digits' + (wrongPulse ? ' shake' : '')}>
          {digits.map((d, i) => (
            <div key={i} className="lock-digit">
              <button onClick={() => change(i, 1)}>▲</button>
              <div className="lock-digit-value">{d}</div>
              <button onClick={() => change(i, -1)}>▼</button>
            </div>
          ))}
        </div>
        <button className="puzzle-submit" onClick={submit} disabled={solved}>
          Відкрити скриню
        </button>
        {solved && <div className="puzzle-success">Замок піддається з тихим клацанням...</div>}
      </div>
    </div>
  )
}
