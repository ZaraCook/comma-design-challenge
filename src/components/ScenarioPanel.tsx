import type { DriveScenario } from '../types/drive'

type ScenarioPanelProps = {
  scenarios: DriveScenario[]
  activeScenarioId: string
  onSelectScenario: (scenarioId: string) => void
}

export function ScenarioPanel({
  scenarios,
  activeScenarioId,
  onSelectScenario,
}: ScenarioPanelProps) {
  return (
    <aside className="scenario-panel">
      <h2>Scenarios</h2>
      <div className="scenario-list">
        {scenarios.map((scenario) => {
          const active = scenario.id === activeScenarioId
          return (
            <button
              key={scenario.id}
              type="button"
              className={`scenario-item ${active ? 'active' : ''}`}
              onClick={() => onSelectScenario(scenario.id)}
            >
              <span className="scenario-name">{scenario.name}</span>
              <span className="scenario-description">{scenario.description}</span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}