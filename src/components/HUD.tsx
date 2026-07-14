export default function HUD({
  locationName,
  locationSubtitle,
  evidenceCount,
  itemCount,
  onOpenJournal,
  onOpenInventory,
}: {
  locationName: string
  locationSubtitle: string
  evidenceCount: number
  itemCount: number
  onOpenJournal: () => void
  onOpenInventory: () => void
}) {
  return (
    <div className="hud">
      <div className="hud-location">
        <div className="hud-location-name">{locationName}</div>
        <div className="hud-location-subtitle">{locationSubtitle}</div>
      </div>
      <div className="hud-buttons">
        <button className="hud-btn" onClick={onOpenJournal}>
          📖 Журнал <span className="hud-badge">{evidenceCount}</span>
        </button>
        <button className="hud-btn" onClick={onOpenInventory}>
          🎒 Інвентар <span className="hud-badge">{itemCount}</span>
        </button>
      </div>
      <div className="hud-hint">WASD / стрілки — рух · E — взаємодія</div>
    </div>
  )
}
