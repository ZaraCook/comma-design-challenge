import type { ReactNode } from 'react'
import { getConfidenceColor, getFrameThickness, getPulseDuration } from '../utils/driveMath'

type ConfidenceFrameProps = {
  confidence: number
  children: ReactNode
}

export function ConfidenceFrame({ confidence, children }: ConfidenceFrameProps) {
  const color = getConfidenceColor(confidence)
  const thickness = getFrameThickness(confidence)
  const duration = getPulseDuration(confidence)

  return (
    <div
      className="confidence-frame"
      style={{
        ['--frame-color' as string]: color,
        ['--frame-thickness' as string]: `${thickness}px`,
        ['--frame-pulse-duration' as string]: duration,
      }}
    >
      {children}
    </div>
  )
}