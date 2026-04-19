export function RationalePanel() {
  return (
    <section className="info-panel" aria-label="Design rationale">
      <h2>Why this works</h2>
      <div className="rationale-list">
        <article>
          <p className="rationale-title">Confidence uses the perimeter</p>
          <p>
            The outer frame is readable in peripheral vision on a windshield-mounted display, so drivers sense trust
            changes without shifting focus.
          </p>
        </article>

        <article>
          <p className="rationale-title">Control effort uses directional edges</p>
          <p>
            Left/right edges map steering demand, top maps acceleration, and bottom maps braking, creating a spatial
            cue that is faster to interpret than separate bars.
          </p>
        </article>

        <article>
          <p className="rationale-title">Text is intentionally minimized</p>
          <p>
            One short state line preserves glanceability. The system stays quiet when reliable and explicit only when
            uncertainty or actuator strain increases.
          </p>
        </article>
      </div>
    </section>
  )
}
