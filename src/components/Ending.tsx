import { useEffect, useState } from 'react'

const LETTER = `Люба Паулечко,

Якщо ти читаєш це — значить, ти пройшла весь шлях: крізь туман, шифри й тишу
старого маєтку. Жодного скарбу в цій скрині немає. Є тільки ми — Віка та
Андрій — і те, що ми насправді хотіли сказати вже давно.

З Днем народження!

Дякуємо, що ти завжди уважна до деталей, завжди на крок попереду в будь-якій
загадці — і завжди поруч, коли загадка називається життям. Ця гра — наш
маленький подарунок: історія, яку ми вигадали лише для тебе.

Нехай цей рік принесе стільки ж дива, скільки ти щодня приносиш нам.

З любов'ю,
Віка та Андрій`

export default function Ending({ onRestart }: { onRestart: () => void }) {
  const [visibleChars, setVisibleChars] = useState(0)
  const [showRestart, setShowRestart] = useState(false)

  useEffect(() => {
    if (visibleChars >= LETTER.length) {
      const t = setTimeout(() => setShowRestart(true), 600)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setVisibleChars((c) => c + 2), 18)
    return () => clearTimeout(t)
  }, [visibleChars])

  return (
    <div className="ending-screen">
      <div className="ending-glow" />
      {[...Array(24)].map((_, i) => (
        <div
          key={i}
          className="ending-particle"
          style={{
            left: `${(i * 37) % 100}%`,
            animationDelay: `${(i % 8) * 0.6}s`,
            animationDuration: `${6 + (i % 5)}s`,
          }}
        />
      ))}
      <div className="ending-chest">🎁</div>
      <div className="ending-letter">
        <div className="ending-letter-title">З Днем народження, Паула</div>
        <pre className="ending-letter-text">{LETTER.slice(0, visibleChars)}</pre>
        {showRestart && (
          <button className="ending-restart" onClick={onRestart}>
            Почати історію знову
          </button>
        )}
      </div>
    </div>
  )
}
