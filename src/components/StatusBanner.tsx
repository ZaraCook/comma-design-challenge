import { AlertTriangle, CheckCircle2, Eye } from 'lucide-react'
import { getConfidenceBand } from '../utils/driveMath'

type StatusBannerProps = {
  confidence: number
  message?: string
}

export function StatusBanner({ confidence, message }: StatusBannerProps) {
  const band = getConfidenceBand(confidence)

  if (band === 'reliable') {
    return (
      <div className="status-banner reliable">
        <CheckCircle2 size={16} />
        <span>{message ?? 'Stable'}</span>
      </div>
    )
  }

  if (band === 'uncertain') {
    return (
      <div className="status-banner uncertain">
        <Eye size={16} />
        <span>{message ?? 'Watch closely'}</span>
      </div>
    )
  }

  return (
    <div className="status-banner critical">
      <AlertTriangle size={16} />
      <span>{message ?? 'Take over now'}</span>
    </div>
  )
}