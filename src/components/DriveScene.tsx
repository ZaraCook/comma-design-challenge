type DriveSceneProps = {
  curveDirection: 'left' | 'right' | 'straight'
}

export function DriveScene({ curveDirection }: DriveSceneProps) {
  const laneClass =
    curveDirection === 'left'
      ? 'lane left'
      : curveDirection === 'right'
        ? 'lane right'
        : 'lane straight'

  return (
    <div className="drive-scene">
      <div className="road" />
      <div className={laneClass} />
      <div className="car-chip">YOU</div>
    </div>
  )
}