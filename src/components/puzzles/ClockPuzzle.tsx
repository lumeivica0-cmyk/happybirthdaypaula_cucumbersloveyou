import { useState } from 'react'

const TARGET_HOUR = 8
const TARGET_MIN = 15

export default function ClockPuzzle({
  onSolve,
  onClose,
}: {
  onSolve: () => void
  onClose: () => void
}) {
  const [hour, setHour] = useState(12)
  const [minute, setMinute] = useState(0)
  const [solved, setSolved] = useState(false)
  const [wrongPulse, setWrongPulse] = useState(false)

  const hourAngle = (hour % 12) * 30 + minute * 0.5
  const minuteAngle = minute * 6

  function submit() {
    if (hour === TARGET_HOUR && minute === TARGET_MIN) {
      setSolved(true)
      setTimeout(onSolve, 900)
    } else {
      setWrongPulse(true)
      setTimeout(() => setWrongPulse(false), 500)
    }
  }

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel puzzle-panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h2>Великий годинник</h2>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>
        <p className="puzzle-instructions">
          Виставте на годиннику час, який згадується в особистих записах Кроу.
        </p>
        <div className={'clock-face' + (wrongPulse ? ' shake' : '')}>
          <div className="clock-hand hour" style={{ transform: `rotate(${hourAngle}deg)` }} />
          <div className="clock-hand minute" style={{ transform: `rotate(${minuteAngle}deg)` }} />
          <div className="clock-center" />
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="clock-tick"
              style={{ transform: `rotate(${i * 30}deg) translateY(-92px)` }}
            />
          ))}
        </div>
        <div className="clock-controls">
          <div className="clock-stepper">
            <span>Година</span>
            <div>
              <button onClick={() => setHour((h) => (h + 11) % 12 || 12)}>−</button>
              <strong>{hour}</strong>
              <button onClick={() => setHour((h) => (h % 12) + 1)}>+</button>
            </div>
          </div>
          <div className="clock-stepper">
            <span>Хвилина</span>
            <div>
              <button onClick={() => setMinute((m) => (m + 55) % 60)}>−</button>
              <strong>{minute.toString().padStart(2, '0')}</strong>
              <button onClick={() => setMinute((m) => (m + 5) % 60)}>+</button>
            </div>
          </div>
        </div>
        <button className="puzzle-submit" onClick={submit} disabled={solved}>
          Зупинити годинник
        </button>
        {solved && <div className="puzzle-success">Механізм завмер. Щось у стіні поруч зрушилося...</div>}
      </div>
    </div>
  )
}
