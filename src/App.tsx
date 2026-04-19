import { useMemo, useState } from 'react'
import { ConfidenceFrame } from './components/ConfidenceFrame'
import { ControlEdges } from './components/ControlEdges'
import { DashboardCard } from './components/DashboardCard'
import { DriveScene } from './components/DriveScene'
import { ScenarioPanel } from './components/ScenarioPanel'
import { StatusBanner } from './components/StatusBanner'
import { scenarios } from './data/scenarios'
import { formatPercent } from './utils/driveMath'

export default function App() {
  const [activeScenarioId, setActiveScenarioId] = useState(scenarios[0].id)

  const activeScenario = useMemo(
    () => scenarios.find((scenario) => scenario.id === activeScenarioId) ?? scenarios[0],
    [activeScenarioId],
  )

  return (
    <div className="app-shell">
      <ScenarioPanel
        scenarios={scenarios}
        activeScenarioId={activeScenario.id}
        onSelectScenario={setActiveScenarioId}
      />

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">comma.ai design challenge</p>
            <h1>Confidence as ambient tension</h1>
          </div>
        </header>

        <ConfidenceFrame confidence={activeScenario.confidence}>
          <div className="device-surface">
            <ControlEdges
              steeringLoad={activeScenario.steeringLoad}
              brakeLoad={activeScenario.brakeLoad}
              accelLoad={activeScenario.accelLoad}
              curveDirection={activeScenario.curveDirection}
            />

            <div className="device-content">
              <div className="hero-area">
                <div className="hero-left">
                  <div className="speed-block">
                    <div className="speed-value">71</div>
                    <div className="speed-unit">mph</div>
                  </div>
                  <StatusBanner
                    confidence={activeScenario.confidence}
                    message={activeScenario.message}
                  />
                </div>

                <DriveScene curveDirection={activeScenario.curveDirection} />
              </div>

              <section className="metrics-grid">
                <DashboardCard
                  label="Driving confidence"
                  value={formatPercent(activeScenario.confidence)}
                  helper="Ambient border color, thickness, and pulse reflect overall confidence."
                />
                <DashboardCard
                  label="Steering headroom used"
                  value={formatPercent(activeScenario.steeringLoad)}
                  helper="Edge loading appears on the side of the demanded turn."
                />
                <DashboardCard
                  label="Brake headroom used"
                  value={formatPercent(activeScenario.brakeLoad)}
                  helper="Bottom edge fills as braking effort increases."
                />
                <DashboardCard
                  label="Acceleration headroom used"
                  value={formatPercent(activeScenario.accelLoad)}
                  helper="Top edge fills as acceleration demand increases."
                />
              </section>
            </div>
          </div>
        </ConfidenceFrame>
      </main>
    </div>
  )
}