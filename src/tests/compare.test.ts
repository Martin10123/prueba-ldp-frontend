import { describe, expect, it } from 'vitest'
import { buildCompareViewModel, parseIdsParam } from '../helpers/compare'
import type { PlayerComparisonItem } from '../types/player'

const makePlayer = (params: {
  id: string
  name: string
  goals: number
  assists: number
  minutesPlayed: number
  matchesPlayed: number
}): PlayerComparisonItem => ({
  id: params.id,
  name: params.name,
  birthDate: '2000-05-10T00:00:00.000Z',
  nationality: 'Argentina',
  position: 'ST',
  photoUrl: '',
  currentTeamId: 'team-1',
  currentTeamName: 'LDP FC',
  isActive: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  currentTeam: {
    id: 'team-1',
    name: 'LDP FC',
    country: 'Argentina',
    logoUrl: '',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  stats: [
    {
      id: `stat-${params.id}`,
      playerId: params.id,
      seasonId: 'season-1',
      teamId: 'team-1',
      matchesPlayed: params.matchesPlayed,
      goals: params.goals,
      assists: params.assists,
      yellowCards: 2,
      redCards: 0,
      minutesPlayed: params.minutesPlayed,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      season: {
        id: 'season-1',
        year: 2026,
        name: '2025-2026',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      team: {
        id: 'team-1',
        name: 'LDP FC',
        country: 'Argentina',
        logoUrl: '',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    },
  ],
})

describe('helpers de comparacion', () => {
  it('parsea ids sin duplicados y limita el resultado a 3 elementos', () => {
    const parsed = parseIdsParam(' p1, p2, p1, p3, p4 ')
    expect(parsed).toEqual(['p1', 'p2', 'p3'])
  })

  it('arma datasets de comparacion para graficas y tabla', () => {
    const selectedIds = ['p1', 'p2']
    const data = [
      makePlayer({ id: 'p1', name: 'Player 1', goals: 10, assists: 6, minutesPlayed: 900, matchesPlayed: 12 }),
      makePlayer({ id: 'p2', name: 'Player 2', goals: 5, assists: 3, minutesPlayed: 900, matchesPlayed: 12 }),
    ]

    const viewModel = buildCompareViewModel(selectedIds, data)

    expect(viewModel.playerStats).toHaveLength(2)
    expect(viewModel.radarData.length).toBeGreaterThan(0)
    expect(viewModel.barData.length).toBeGreaterThan(0)
    expect(viewModel.metricRows.length).toBeGreaterThan(0)

    const goalsBar = viewModel.barData.find((item) => item.metric === 'Goles')
    expect(goalsBar).toBeDefined()
    expect(goalsBar?.p1).toBe(100)
    expect(Number(goalsBar?.p2)).toBeLessThan(100)
  })

  it('mantiene orden de jugadores seleccionados y asigna colores para 3 jugadores', () => {
    const selectedIds = ['p3', 'p1', 'p2']
    const data = [
      makePlayer({ id: 'p1', name: 'Player 1', goals: 8, assists: 4, minutesPlayed: 800, matchesPlayed: 11 }),
      makePlayer({ id: 'p2', name: 'Player 2', goals: 6, assists: 2, minutesPlayed: 850, matchesPlayed: 11 }),
      makePlayer({ id: 'p3', name: 'Player 3', goals: 12, assists: 5, minutesPlayed: 900, matchesPlayed: 12 }),
    ]

    const viewModel = buildCompareViewModel(selectedIds, data)

    expect(viewModel.playerStats.map((item) => item.series.id)).toEqual(['p3', 'p1', 'p2'])
    expect(viewModel.playerStats.map((item) => item.series.color)).toEqual(['#00E094', '#0C65D4', '#F59E0B'])
  })
})
