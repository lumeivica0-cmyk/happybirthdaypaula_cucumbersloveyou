import type { InventoryItem } from '../types'
import { ICONS } from './icons'

export default function Inventory({
  items,
  onClose,
}: {
  items: InventoryItem[]
  onClose: () => void
}) {
  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel inventory-panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h2>Інвентар</h2>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>
        {items.length === 0 ? (
          <p className="panel-empty">Порожньо. Предмети з'являться тут, коли ви їх підберете.</p>
        ) : (
          <div className="inventory-grid">
            {items.map((it) => (
              <div key={it.id} className="inventory-cell" title={it.description}>
                <span className="inventory-icon">{ICONS[it.icon]}</span>
                <span className="inventory-title">{it.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
