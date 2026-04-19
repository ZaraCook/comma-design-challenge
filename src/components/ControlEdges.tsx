type ControlEdgesProps = {
  steeringLoad: number
  brakeLoad: number
  accelLoad: number
  curveDirection: 'left' | 'right' | 'straight'
}

export function ControlEdges({
  steeringLoad,
  brakeLoad,
  accelLoad,
  curveDirection,
}: ControlEdgesProps) {
  const leftSteering = curveDirection === 'left' ? steeringLoad : steeringLoad * 0.22
  const rightSteering = curveDirection === 'right' ? steeringLoad : steeringLoad * 0.22

  return (
    <>
      <div className="edge edge-top">
        <div className="edge-fill vertical" style={{ height: `${accelLoad}%` }} />
      </div>

      <div className="edge edge-bottom">
        <div className="edge-fill vertical" style={{ height: `${brakeLoad}%` }} />
      </div>

      <div className="edge edge-left">
        <div className="edge-fill horizontal" style={{ width: `${leftSteering}%` }} />
      </div>

      <div className="edge edge-right">
        <div className="edge-fill horizontal" style={{ width: `${rightSteering}%` }} />
      </div>
    </>
  )
}