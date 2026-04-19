export type ConfidenceBand = 'reliable' | 'uncertain' | 'critical'

export type DriveScenario = {
  id: string
  name: string
  description: string
  confidence: number // 0 to 100
  steeringLoad: number // 0 to 100
  brakeLoad: number // 0 to 100
  accelLoad: number // 0 to 100
  curveDirection: 'left' | 'right' | 'straight'
  message?: string
}