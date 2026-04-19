export type Position = 'Delantero' | 'Mediocampista' | 'Defensor' | 'Arquero'

export type PlayerStats = {
  appearances: number
  goals: number
  assists: number
  passes: number
  tackles: number
  aerialDuels: number
  minutes: number
}

export type Player = {
  id: number
  name: string
  age: number
  nationality: string
  position: Position
  team: string
  league: string
  photo: string
  marketValue: string
  summary: string
  stats: PlayerStats
}
