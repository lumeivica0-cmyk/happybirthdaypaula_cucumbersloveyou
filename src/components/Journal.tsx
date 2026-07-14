import { useState } from 'react'
import type { EvidenceItem } from '../types'
import { ICONS } from './icons'

export default function Journal({
  evidence,
  onClose,
}: {
  evidence: EvidenceItem[]
  onClose: () => void
}) {
  const [selected, setSelected] = useState<string | null>(evidence[0]?.id ?? null)
  const current = evidence.find((e) => e.id === selected) ?? evidence[0]

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel journal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h2>Журнал доказів</h2>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>
        {evidence.length === 0 ? (
          <p className="panel-empty">Ще нічого не знайдено. Досліджуйте маєток — натискайте E біля предметів.</p>
        ) : (
          <div className="journal-body">
            <ul className="journal-list">
              {evidence.map((e) => (
                <li key={e.id}>
                  <button
                    className={'journal-item' + (e.id === selected ? ' active' : '')}
                    onClick={() => setSelected(e.id)}
                  >
                    <span className="journal-item-icon">{ICONS[e.icon]}</span>
                    {e.title}
                  </button>
                </li>
              ))}
            </ul>
            {current && (
              <div className="journal-detail">
                <h3>{current.title}</h3>
                <p>{current.description}</p>
                {current.analysis && <p className="journal-analysis">💡 {current.analysis}</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
