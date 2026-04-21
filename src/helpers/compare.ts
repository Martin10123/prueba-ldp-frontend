import type { CompareBarDatum, CompareMetricRow, CompareRadarDatum, ComparePlayerComputed } from '../types/typesCompare'
import type { PlayerComparisonItem, PlayerListItem, PlayersQueryFilters } from '../types/player'
import { getPositionLabel } from '../utils/playerPosition'

const colorPalette = ['#00E094', '#0C65D4', '#F59E0B'] as const

export const comparePickerFilters: PlayersQueryFilters = {
  page: 1,
  limit: 50,
}

type AggregatedStats = {
  matchesPlayed: number
  goals: number
  assists: number
  yellowCards: number
  redCards: number
  minutesPlayed: number
}

type MetricDefinition = {
  key: string
  label: string
  higherIsBetter?: boolean
  toDisplay: (value: number) => string
}

const metricDefinitions: MetricDefinition[] = [
  { key: 'matchesPlayed', label: 'Partidos jugados', toDisplay: formatInteger },
  { key: 'minutesPlayed', label: 'Minutos jugados', toDisplay: formatInteger },
  { key: 'goals', label: 'Goles', toDisplay: formatInteger },
  { key: 'assists', label: 'Asistencias', toDisplay: formatInteger },
  { key: 'goalsPer90', label: 'Goles por 90', toDisplay: formatDecimal },
  { key: 'assistsPer90', label: 'Asistencias por 90', toDisplay: formatDecimal },
  { key: 'gaPer90', label: 'G+A por 90', toDisplay: formatDecimal },
  { key: 'minutesPerMatch', label: 'Minutos por partido', toDisplay: formatDecimal },
  { key: 'cardsPer90', label: 'Tarjetas por 90', higherIsBetter: false, toDisplay: formatDecimal },
]

const radarMetricDefinitions: MetricDefinition[] = [
  { key: 'goalsPer90', label: 'Goles/90', toDisplay: formatDecimal },
  { key: 'assistsPer90', label: 'Asist./90', toDisplay: formatDecimal },
  { key: 'gaPer90', label: 'G+A/90', toDisplay: formatDecimal },
  { key: 'matchesPlayed', label: 'Partidos', toDisplay: formatInteger },
  { key: 'minutesPlayed', label: 'Minutos', toDisplay: formatInteger },
  { key: 'cardsPer90', label: 'Disciplina', higherIsBetter: false, toDisplay: formatDecimal },
]

const barMetricDefinitions: MetricDefinition[] = [
  { key: 'matchesPlayed', label: 'Partidos', toDisplay: formatInteger },
  { key: 'goals', label: 'Goles', toDisplay: formatInteger },
  { key: 'assists', label: 'Asistencias', toDisplay: formatInteger },
  { key: 'gaPer90', label: 'G+A/90', toDisplay: formatDecimal },
]

export const parseIdsParam = (value: string | null) =>
  Array.from(new Set((value ?? '').split(',').map((id) => id.trim()).filter(Boolean))).slice(0, 3)

export const sameIds = (left: string[], right: string[]) =>
  left.length === right.length && left.every((item, index) => item === right[index])

export function formatInteger(value: number) {
  return new Intl.NumberFormat('es-CO').format(Math.round(value))
}

export function formatDecimal(value: number) {
  return value.toFixed(2)
}

function getAge(birthDate: string) {
  const birth = new Date(birthDate)
  if (Number.isNaN(birth.getTime())) return null

  const ageDate = new Date(Date.now() - birth.getTime())
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

function divideSafe(numerator: number, denominator: number) {
  if (!Number.isFinite(denominator) || denominator <= 0) return 0
  return numerator / denominator
}

function aggregateStats(stats: PlayerComparisonItem['stats']): AggregatedStats {
  return stats.reduce<AggregatedStats>(
    (accumulator, item) => ({
      matchesPlayed: accumulator.matchesPlayed + item.matchesPlayed,
      goals: accumulator.goals + item.goals,
      assists: accumulator.assists + item.assists,
      yellowCards: accumulator.yellowCards + item.yellowCards,
      redCards: accumulator.redCards + item.redCards,
      minutesPlayed: accumulator.minutesPlayed + item.minutesPlayed,
    }),
    {
      matchesPlayed: 0,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      minutesPlayed: 0,
    },
  )
}

function toComputedStats(player: PlayerComparisonItem, color: string): ComparePlayerComputed {
  const totals = aggregateStats(player.stats)
  const cards = totals.yellowCards + totals.redCards

  return {
    series: {
      id: player.id,
      name: player.name,
      teamName: player.currentTeamName ?? player.currentTeam?.name ?? 'Sin equipo',
      photoUrl: player.photoUrl,
      position: getPositionLabel(player.position),
      nationality: player.nationality,
      age: getAge(player.birthDate),
      color,
    },
    metrics: {
      matchesPlayed: totals.matchesPlayed,
      minutesPlayed: totals.minutesPlayed,
      goals: totals.goals,
      assists: totals.assists,
      goalsPer90: divideSafe(totals.goals * 90, totals.minutesPlayed),
      assistsPer90: divideSafe(totals.assists * 90, totals.minutesPlayed),
      gaPer90: divideSafe((totals.goals + totals.assists) * 90, totals.minutesPlayed),
      minutesPerMatch: divideSafe(totals.minutesPlayed, totals.matchesPlayed),
      cardsPer90: divideSafe(cards * 90, totals.minutesPlayed),
    },
  }
}

function normalizeMetricValue(value: number, values: number[], higherIsBetter: boolean) {
  if (values.length === 0) return 0

  if (higherIsBetter) {
    const maxValue = Math.max(...values)
    if (maxValue <= 0) return 0
    return (value / maxValue) * 100
  }

  const maxValue = Math.max(...values)
  if (maxValue <= 0) return 100
  return ((maxValue - value) / maxValue) * 100
}

export const filterPlayersBySearch = (players: PlayerListItem[], searchInput: string) => {
  const query = searchInput.trim().toLowerCase()
  if (!query) return players

  return players.filter((player) => {
    const candidate = `${player.name} ${player.currentTeamName} ${player.nationality}`.toLowerCase()
    return candidate.includes(query)
  })
}

export const normalizeSelectedIds = (currentIds: string[], players: PlayerListItem[], targetCount: number) => {
  const validIds = new Set(players.map((item) => item.id))
  const next = Array.from(new Set(currentIds.filter((id) => validIds.has(id))))

  for (const player of players) {
    if (next.length >= targetCount) break
    if (!next.includes(player.id)) {
      next.push(player.id)
    }
  }

  return next.slice(0, targetCount)
}

export const applySelectedId = (
  currentIds: string[],
  index: number,
  playerId: string,
  players: PlayerListItem[],
  targetCount: number,
) => {
  const next = currentIds.slice(0, targetCount)
  next[index] = playerId

  const uniqueIds = Array.from(new Set(next.filter(Boolean)))

  for (const player of players) {
    if (uniqueIds.length >= targetCount) break
    if (!uniqueIds.includes(player.id)) {
      uniqueIds.push(player.id)
    }
  }

  return uniqueIds.slice(0, targetCount)
}

export const buildCompareViewModel = (selectedIds: string[], data: PlayerComparisonItem[] | undefined) => {
  const dataMap = new Map((data ?? []).map((player) => [player.id, player]))
  const comparedPlayers = selectedIds
    .map((id) => dataMap.get(id))
    .filter((item): item is PlayerComparisonItem => Boolean(item))

  const playerStats = comparedPlayers.map((player, index) => toComputedStats(player, colorPalette[index] ?? '#B0B0B0'))

  const radarData: CompareRadarDatum[] = radarMetricDefinitions.map((metric) => {
    const values = playerStats.map((item) => item.metrics[metric.key] ?? 0)

    return playerStats.reduce<CompareRadarDatum>(
      (accumulator, player) => ({
        ...accumulator,
        [player.series.id]: normalizeMetricValue(
          player.metrics[metric.key] ?? 0,
          values,
          metric.higherIsBetter ?? true,
        ),
      }),
      { metric: metric.label },
    )
  })

  const metricRows: CompareMetricRow[] = metricDefinitions.map((metric) => ({
    label: metric.label,
    higherIsBetter: metric.higherIsBetter,
    values: playerStats.map((player) => {
      const value = player.metrics[metric.key] ?? 0
      return {
        playerId: player.series.id,
        value,
        display: metric.toDisplay(value),
      }
    }),
  }))

  const barData: CompareBarDatum[] = barMetricDefinitions.map((metric) => {
    const values = playerStats.map((item) => item.metrics[metric.key] ?? 0)

    return playerStats.reduce<CompareBarDatum>(
      (accumulator, player) => ({
        ...accumulator,
        [player.series.id]: normalizeMetricValue(
          player.metrics[metric.key] ?? 0,
          values,
          metric.higherIsBetter ?? true,
        ),
      }),
      { metric: metric.label },
    )
  })

  return {
    playerStats,
    radarData,
    metricRows,
    barData,
  }
}
