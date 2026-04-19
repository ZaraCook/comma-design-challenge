import type { ConfidenceBand } from '../types/drive'

export function getConfidenceBand(confidence: number): ConfidenceBand {
  if (confidence >= 70) return 'reliable'
  if (confidence >= 40) return 'uncertain'
  return 'critical'
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 70) return '#21c58e'
  if (confidence >= 40) return '#ffb648'
  return '#ff5d5d'
}

export function getPulseDuration(confidence: number): string {
  if (confidence >= 70) return '4.6s'
  if (confidence >= 40) return '2.4s'
  return '1.15s'
}

export function getFrameThickness(confidence: number): number {
  if (confidence >= 70) return 10
  if (confidence >= 40) return 16
  return 22
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}