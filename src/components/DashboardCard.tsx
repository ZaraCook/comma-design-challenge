type DashboardCardProps = {
  label: string
  value: string
  helper?: string
}

export function DashboardCard({ label, value, helper }: DashboardCardProps) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-label">{label}</div>
      <div className="dashboard-card-value">{value}</div>
      {helper ? <div className="dashboard-card-helper">{helper}</div> : null}
    </div>
  )
}