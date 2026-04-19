type DriverExperienceProps = {
  confidence: number
  steeringLoad: number
  brakeLoad: number
  accelLoad: number
  curveDirection: 'left' | 'right' | 'straight'
  statusMessage?: string
  scenarioName: string
  scenarioDescription: string
}

function getNavigationCue(curveDirection: DriverExperienceProps['curveDirection']): string {
  if (curveDirection === 'left') {
    return 'Lane bends left ahead'
  }

  if (curveDirection === 'right') {
    return 'Lane bends right ahead'
  }

  return 'Keep straight and centered'
}

export function DriverExperience({
  confidence,
  steeringLoad,
  brakeLoad,
  accelLoad,
  curveDirection,
  statusMessage,
  scenarioName,
  scenarioDescription,
}: DriverExperienceProps) {
  const roundedConfidence = Math.round(confidence)
  const roundedSteeringLoad = Math.round(steeringLoad)
  const roundedBrakeLoad = Math.round(brakeLoad)
  const roundedAccelLoad = Math.round(accelLoad)
  const laneCue = getNavigationCue(curveDirection)
  const speed = confidence >= 80 ? 71 : confidence >= 50 ? 58 : 43
  const routeLabel = curveDirection === 'left' ? 'Route bends left' : curveDirection === 'right' ? 'Route bends right' : 'Route stays straight'

  return (
    <div className="driver-experience">
      <header className="driver-experience-header">
        <div>
          <p className="eyebrow">Driver view</p>
          <h2>Windshield view</h2>
          <p className="driver-experience-copy">A forward-facing road view with a restrained map layer and minimal in-car HUD.</p>
        </div>
        <div className="driver-experience-summary">
          <span className="driver-chip driver-chip-primary">{statusMessage ?? 'Cruising'}</span>
          <span className="driver-chip">{roundedConfidence}% confidence</span>
          <span className="driver-chip">{scenarioName}</span>
        </div>
      </header>

      <div className="driver-stage">
        <div className="driver-map-background" aria-hidden="true">
          <div className="driver-map-grid" />
          <div className="driver-map-block driver-map-block--north" />
          <div className="driver-map-block driver-map-block--south" />
          <div className="driver-map-block driver-map-block--east" />
          <div className="driver-map-road driver-map-road--arterial-a" />
          <div className="driver-map-road driver-map-road--arterial-b" />
          <div className="driver-map-road driver-map-road--arterial-c" />
          <div className="driver-map-road driver-map-road--service" />
        </div>

        <div className="driver-windshield">
          <div className="driver-glass-curve driver-glass-curve--left" aria-hidden="true" />
          <div className="driver-glass-curve driver-glass-curve--right" aria-hidden="true" />

          <div className="driver-dashboard driver-dashboard--left">
            <span>Speed</span>
            <strong>{speed}</strong>
            <small>mph</small>
          </div>
          <div className="driver-dashboard driver-dashboard--right">
            <span>Route cue</span>
            <strong>{laneCue}</strong>
            <small>{scenarioDescription}</small>
          </div>

          <div className="driver-map-canvas">
            <div className="driver-map-haze" />
            <div className="driver-windshield-frame" aria-hidden="true" />
            <div className="driver-road-horizon" />
            <div className="driver-road-scene">
              <div className="driver-road-body" data-direction={curveDirection} />
              <div className="driver-road-shoulders" data-direction={curveDirection} />
              <div className="driver-road-lanes" data-direction={curveDirection} />
              <div className="driver-road-route" data-direction={curveDirection} />
              <div className="driver-road-vehicle" />
            </div>
            <div className="driver-map-guidance">
              <span>Navigation</span>
              <strong>{routeLabel}</strong>
              <small>{roundedConfidence}% confidence</small>
            </div>
            <div className="driver-map-hud driver-map-hud--left">Route preview</div>
            <div className="driver-map-hud driver-map-hud--right">{statusMessage ?? 'Cruising'}</div>
            <div className="driver-rearview-mirror" aria-hidden="true">
              <span />
            </div>
            <div className="driver-dashboard-lip" aria-hidden="true" />
            <div className="driver-steering-wheel" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="driver-glare" aria-hidden="true" />
        </div>

        <div className="driver-status-rail">
          <div className="driver-status-item">
            <span>Steering</span>
            <strong>{roundedSteeringLoad}%</strong>
          </div>
          <div className="driver-status-item">
            <span>Brake</span>
            <strong>{roundedBrakeLoad}%</strong>
          </div>
          <div className="driver-status-item">
            <span>Acceleration</span>
            <strong>{roundedAccelLoad}%</strong>
          </div>
          <div className="driver-status-item driver-status-item--wide">
            <span>Route cue</span>
            <strong>{laneCue}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
