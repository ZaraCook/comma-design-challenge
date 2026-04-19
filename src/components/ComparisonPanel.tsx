import { getConfidenceBand } from '../utils/driveMath'

type ComparisonPanelProps = {
  confidence: number
  steeringLoad: number
  brakeLoad: number
  accelLoad: number
}

function getCurrentOpenpilotBehavior(confidence: number, peakLoad: number): string {
  if (confidence >= 45 && peakLoad < 85) {
    return 'Mostly silent until a threshold event, so the first strong cue can arrive late.'
  }

  if (confidence >= 25 || peakLoad < 95) {
    return 'Escalates once uncertainty is already visible or actuator limits are close.'
  }

  return 'Urgent intervention prompt near disengagement risk.'
}

function getProposedBehavior(confidence: number, peakLoad: number): string {
  const band = getConfidenceBand(confidence)

  if (band === 'reliable' && peakLoad < 70) {
    return 'Calm thin perimeter + low edge load. Quietly confirms trust without noise.'
  }

  if (band === 'uncertain' || peakLoad < 90) {
    return 'Perimeter shifts toward amber and pulses; directional edge starts loading before hard alerts.'
  }

  return 'Tight red pulse + saturated directional edge communicates takeover urgency immediately.'
}

export function ComparisonPanel({ confidence, steeringLoad, brakeLoad, accelLoad }: ComparisonPanelProps) {
  const peakLoad = Math.max(steeringLoad, brakeLoad, accelLoad)

  return (
    <section className="info-panel comparison-panel" aria-label="Behavior comparison">
      <h2>Comparison mode</h2>
      <div className="comparison-grid">
        <article className="comparison-card baseline">
          <p className="comparison-title">Current openpilot alert behavior</p>
          <p>{getCurrentOpenpilotBehavior(confidence, peakLoad)}</p>
        </article>
        <article className="comparison-card proposed">
          <p className="comparison-title">Proposed proactive behavior</p>
          <p>{getProposedBehavior(confidence, peakLoad)}</p>
        </article>
      </div>
    </section>
  )
}
