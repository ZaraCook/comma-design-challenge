type DriveSceneProps = {
  curveDirection: 'left' | 'right' | 'straight'
  confidence: number
  steeringLoad: number
  brakeLoad: number
  accelLoad: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function DriveScene({ curveDirection, confidence, steeringLoad, brakeLoad, accelLoad }: DriveSceneProps) {
  const laneClass =
    curveDirection === 'left'
      ? 'lane left'
      : curveDirection === 'right'
        ? 'lane right'
        : 'lane straight'

  const confidenceDrop = 100 - confidence
  const sceneTension = clamp(confidenceDrop * 0.72 + steeringLoad * 0.2 + brakeLoad * 0.08, 0, 100)
  const leadDistance = clamp(78 - confidenceDrop * 0.32 - brakeLoad * 0.14, 28, 78)
  const leadDrift = curveDirection === 'left' ? -steeringLoad * 0.08 : curveDirection === 'right' ? steeringLoad * 0.08 : 0
  const curveOffset = curveDirection === 'left' ? -12 : curveDirection === 'right' ? 12 : 0
  const flowDuration = `${clamp(5.4 - confidence / 25, 2.3, 5.4).toFixed(2)}s`

  return (
    <div
      className="drive-scene"
      style={{
        ['--scene-tension' as string]: sceneTension,
        ['--lead-distance' as string]: `${leadDistance}%`,
        ['--lead-drift' as string]: `${leadDrift}deg`,
        ['--curve-offset' as string]: `${curveOffset}px`,
        ['--flow-duration' as string]: flowDuration,
        ['--steering-load' as string]: `${steeringLoad}%`,
        ['--brake-load' as string]: `${brakeLoad}%`,
        ['--accel-load' as string]: `${accelLoad}%`,
      }}
    >
      <div className="scene-horizon" />
      <div className="scene-roadflow" />
      <div className="scene-road" />
      <div className={laneClass} />
      <div className="scene-lead-vehicle">
        <div className="lead-car-body" />
        <div className="lead-car-lights" />
      </div>
      <div className="scene-guidance" />
      <div className="scene-car" />
      <div className="scene-caption">
        <span>Perimeter confidence</span>
        <strong>{Math.round(confidence)}%</strong>
      </div>
    </div>
  )
}