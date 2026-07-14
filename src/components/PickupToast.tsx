import { useEffect } from 'react'
import type { EvidenceIcon } from '../types'
import { ICONS } from './icons'

export default function PickupToast({
  title,
  kind,
  icon,
  onDone,
}: {
  title: string
  kind: 'evidence' | 'item'
  icon: EvidenceIcon
  onDone: () => void
}) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="pickup-toast">
      <span className="pickup-icon">{ICONS[icon]}</span>
      <div>
        <div className="pickup-kind">{kind === 'evidence' ? 'Новий доказ' : 'Новий предмет'}</div>
        <div className="pickup-title">{title}</div>
      </div>
    </div>
  )
}
