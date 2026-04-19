import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ConfidenceFrame } from './components/ConfidenceFrame'
import { ComparisonPanel } from './components/ComparisonPanel'
import { ControlEdges } from './components/ControlEdges'
import { DashboardCard } from './components/DashboardCard'
import { DriverExperience } from './components/DriverExperience'
import { DriveScene } from './components/DriveScene'
import { RationalePanel } from './components/RationalePanel'
import { ScenarioPanel } from './components/ScenarioPanel'
import { StatusBanner } from './components/StatusBanner'
import { scenarios } from './data/scenarios'
import { formatPercent, getConfidenceBand } from './utils/driveMath'

const TRANSITION_MS = import.meta.env.MODE === 'test' ? 0 : 880

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function lerp(start: number, end: number, amount: number): number {
  return start + (end - start) * amount
}

function easeInOutCubic(amount: number): number {
  return amount < 0.5 ? 4 * amount * amount * amount : 1 - Math.pow(-2 * amount + 2, 3) / 2
}

function getStatusMessage(confidence: number, edgePeak: number): string {
  const band = getConfidenceBand(confidence)

  if (band === 'reliable' && edgePeak < 65) {
    return 'Stable'
  }

  if (band === 'critical' || edgePeak > 88) {
    return 'Take over now'
  }

  return 'Watch closely'
}

export default function App() {
  const [timelinePosition, setTimelinePosition] = useState(0)
  const [autoplayEnabled, setAutoplayEnabled] = useState(false)
  const [comparisonMode, setComparisonMode] = useState(true)
  const [viewMode, setViewMode] = useState<'driver' | 'analysis'>('driver')
  const animationFrameRef = useRef<number | null>(null)
  const positionRef = useRef(0)
  const maxScenarioIndex = scenarios.length - 1

  useEffect(() => {
    positionRef.current = timelinePosition
  }, [timelinePosition])

  const animateToIndex = useCallback(
    (targetIndex: number) => {
      const boundedTarget = clamp(targetIndex, 0, maxScenarioIndex)

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      if (TRANSITION_MS === 0) {
        setTimelinePosition(boundedTarget)
        return
      }

      const startPosition = positionRef.current
      const startTime = performance.now()

      const step = (now: number) => {
        const elapsed = now - startTime
        const progress = clamp(elapsed / TRANSITION_MS, 0, 1)
        const eased = easeInOutCubic(progress)

        setTimelinePosition(lerp(startPosition, boundedTarget, eased))

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(step)
        } else {
          animationFrameRef.current = null
        }
      }

      animationFrameRef.current = requestAnimationFrame(step)
    },
    [maxScenarioIndex],
  )

  useEffect(
    () => () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    if (!autoplayEnabled) {
      return
    }

    const autoplayId = window.setInterval(() => {
      const currentIndex = Math.round(positionRef.current)
      const nextIndex = currentIndex >= maxScenarioIndex ? 0 : currentIndex + 1
      animateToIndex(nextIndex)
    }, 3200)

    return () => window.clearInterval(autoplayId)
  }, [animateToIndex, autoplayEnabled, maxScenarioIndex])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const targetElement = event.target as HTMLElement | null
      const isInput = targetElement?.tagName === 'INPUT'
      if (isInput) {
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        animateToIndex(Math.round(positionRef.current) + 1)
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        animateToIndex(Math.round(positionRef.current) - 1)
      }

      if (event.code === 'Space') {
        event.preventDefault()
        setAutoplayEnabled((previous) => !previous)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [animateToIndex])

  const activeScenario = useMemo(() => {
    const lowerIndex = clamp(Math.floor(timelinePosition), 0, maxScenarioIndex)
    const upperIndex = clamp(Math.ceil(timelinePosition), 0, maxScenarioIndex)
    const mix = clamp(timelinePosition - lowerIndex, 0, 1)

    const lowerScenario = scenarios[lowerIndex]
    const upperScenario = scenarios[upperIndex]

    const confidence = lerp(lowerScenario.confidence, upperScenario.confidence, mix)
    const steeringLoad = lerp(lowerScenario.steeringLoad, upperScenario.steeringLoad, mix)
    const brakeLoad = lerp(lowerScenario.brakeLoad, upperScenario.brakeLoad, mix)
    const accelLoad = lerp(lowerScenario.accelLoad, upperScenario.accelLoad, mix)
    const edgePeak = Math.max(steeringLoad, brakeLoad, accelLoad)
    const curveDirection = mix < 0.5 ? lowerScenario.curveDirection : upperScenario.curveDirection
    const nearestScenario = scenarios[clamp(Math.round(timelinePosition), 0, maxScenarioIndex)]

    return {
      id: nearestScenario.id,
      name: nearestScenario.name,
      description: nearestScenario.description,
      confidence,
      steeringLoad,
      brakeLoad,
      accelLoad,
      curveDirection,
      message: getStatusMessage(confidence, edgePeak),
    }
  }, [maxScenarioIndex, timelinePosition])

  const activeScenarioIndex = clamp(Math.round(timelinePosition), 0, maxScenarioIndex)

  return (
    <div className="app-shell">
      <ScenarioPanel
        scenarios={scenarios}
        activeScenarioId={activeScenario.id}
        onSelectScenario={(scenarioId) => {
          const selectedIndex = scenarios.findIndex((scenario) => scenario.id === scenarioId)
          if (selectedIndex >= 0) {
            animateToIndex(selectedIndex)
          }
        }}
      />

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">comma.ai design challenge</p>
            <h1>Tension Frame + Control Edge</h1>
            <p className="subtitle">Ambient trust + directional effort, built for peripheral readability.</p>
          </div>

          <div className="topbar-controls">
            <div className="view-toggle" role="tablist" aria-label="Display mode">
              <button
                type="button"
                className={`control-chip ${viewMode === 'driver' ? 'active' : ''}`}
                onClick={() => setViewMode('driver')}
                aria-pressed={viewMode === 'driver'}
              >
                Driver view
              </button>
              <button
                type="button"
                className={`control-chip ${viewMode === 'analysis' ? 'active' : ''}`}
                onClick={() => setViewMode('analysis')}
                aria-pressed={viewMode === 'analysis'}
              >
                Analysis view
              </button>
            </div>
            <button type="button" className="control-chip" onClick={() => setAutoplayEnabled((previous) => !previous)}>
              {autoplayEnabled ? 'Pause autoplay' : 'Start autoplay'}
            </button>
            <button type="button" className="control-chip" onClick={() => setComparisonMode((previous) => !previous)}>
              {comparisonMode ? 'Hide comparison' : 'Show comparison'}
            </button>
          </div>
        </header>

        <section className="timeline-controls" aria-label="Simulation controls">
          <div>
            <p className="timeline-label">Scenario timeline</p>
            <p className="timeline-value" data-testid="active-scenario-name">
              {activeScenario.name}
            </p>
          </div>
          <input
            aria-label="Scenario timeline slider"
            className="timeline-slider"
            type="range"
            min={0}
            max={maxScenarioIndex}
            step={0.01}
            value={timelinePosition}
            onChange={(event) => setTimelinePosition(Number(event.target.value))}
          />
          <div className="timeline-footer">
            <span>Left/Right: scenario</span>
            <span>Space: autoplay</span>
            <span>Step {activeScenarioIndex + 1} of {scenarios.length}</span>
          </div>
        </section>

        {viewMode === 'driver' ? (
          <ConfidenceFrame confidence={activeScenario.confidence}>
            <DriverExperience
              confidence={activeScenario.confidence}
              steeringLoad={activeScenario.steeringLoad}
              brakeLoad={activeScenario.brakeLoad}
              accelLoad={activeScenario.accelLoad}
              curveDirection={activeScenario.curveDirection}
              statusMessage={activeScenario.message}
              scenarioName={activeScenario.name}
              scenarioDescription={activeScenario.description}
            />
          </ConfidenceFrame>
        ) : (
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

                  <DriveScene
                    curveDirection={activeScenario.curveDirection}
                    confidence={activeScenario.confidence}
                    steeringLoad={activeScenario.steeringLoad}
                    brakeLoad={activeScenario.brakeLoad}
                    accelLoad={activeScenario.accelLoad}
                  />
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
        )}

        <section className="support-grid">
          {comparisonMode ? (
            <ComparisonPanel
              confidence={activeScenario.confidence}
              steeringLoad={activeScenario.steeringLoad}
              brakeLoad={activeScenario.brakeLoad}
              accelLoad={activeScenario.accelLoad}
            />
          ) : null}
          <RationalePanel />
        </section>
      </main>
    </div>
  )
}