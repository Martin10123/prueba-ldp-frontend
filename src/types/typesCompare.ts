export type CompareSeriesPlayer = {
  id: string
  name: string
  teamName: string
  photoUrl: string
  position: string
  nationality: string
  age: number | null
  color: string
}

export type CompareRadarDatum = {
  metric: string
} & Record<string, number | string>

export type CompareBarDatum = {
  metric: string
} & Record<string, number | string>

export type CompareMetricCell = {
  playerId: string
  value: number
  display: string
}

export type CompareMetricRow = {
  label: string
  higherIsBetter?: boolean
  values: CompareMetricCell[]
}

export type ComparePlayerComputed = {
  series: CompareSeriesPlayer
  metrics: Record<string, number>
}
