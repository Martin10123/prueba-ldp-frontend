import type { Player, Position } from '../types/player'

export const players: Player[] = [
  {
    id: 1,
    name: 'Miguel Ángel Merentiel',
    age: 30,
    nationality: 'Uruguay',
    position: 'Delantero',
    team: 'CA Boca Juniors',
    league: 'Liga Profesional',
    photo:
      'https://images.unsplash.com/photo-1614632537423-1a66f3d0b1bc?auto=format&fit=crop&w=600&q=80',
    marketValue: '$6.8M',
    summary: 'Segundo delantero con buen ataque al espacio y alta agresividad en presión.',
    stats: {
      appearances: 34,
      goals: 16,
      assists: 5,
      passes: 41,
      tackles: 18,
      aerialDuels: 27,
      minutes: 2460,
    },
  },
  {
    id: 2,
    name: 'Facundo Colidio',
    age: 24,
    nationality: 'Argentina',
    position: 'Delantero',
    team: 'CA River Plate',
    league: 'Liga Profesional',
    photo:
      'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80',
    marketValue: '$8.4M',
    summary: 'Delantero asociativo, explosivo en conducción y muy útil entre líneas.',
    stats: {
      appearances: 31,
      goals: 11,
      assists: 9,
      passes: 73,
      tackles: 12,
      aerialDuels: 21,
      minutes: 2190,
    },
  },
  {
    id: 3,
    name: 'Nicolás Valentini',
    age: 23,
    nationality: 'Argentina',
    position: 'Defensor',
    team: 'CA Boca Juniors',
    league: 'Liga Profesional',
    photo:
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
    marketValue: '$5.1M',
    summary: 'Central zurdo con lectura defensiva y buena salida limpia desde atrás.',
    stats: {
      appearances: 29,
      goals: 2,
      assists: 1,
      passes: 88,
      tackles: 63,
      aerialDuels: 74,
      minutes: 2435,
    },
  },
  {
    id: 4,
    name: 'Cristian Medina',
    age: 22,
    nationality: 'Argentina',
    position: 'Mediocampista',
    team: 'CA Boca Juniors',
    league: 'Liga Profesional',
    photo:
      'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=600&q=80',
    marketValue: '$7.2M',
    summary: 'Interior completo con volumen de juego, presión y progresión por dentro.',
    stats: {
      appearances: 33,
      goals: 6,
      assists: 8,
      passes: 91,
      tackles: 54,
      aerialDuels: 39,
      minutes: 2685,
    },
  },
  {
    id: 5,
    name: 'Kevin Zenón',
    age: 23,
    nationality: 'Argentina',
    position: 'Mediocampista',
    team: 'CA Boca Juniors',
    league: 'Liga Profesional',
    photo:
      'https://images.unsplash.com/photo-1626979619005-3b8fd8f1c75b?auto=format&fit=crop&w=600&q=80',
    marketValue: '$6.4M',
    summary: 'Volante ofensivo con buen pie para filtrar pases y aparecer al segundo palo.',
    stats: {
      appearances: 28,
      goals: 4,
      assists: 10,
      passes: 85,
      tackles: 37,
      aerialDuels: 18,
      minutes: 2240,
    },
  },
]

export const positions: Position[] = ['Delantero', 'Mediocampista', 'Defensor', 'Arquero']
export const nationalities = ['Todas', 'Argentina', 'Uruguay', 'Brasil', 'Colombia']
export const ageRanges = ['Todas', '18-21', '22-25', '26-29', '30+']

export const sidebarIcons = ['◎', '◫', '◧', '◌', '⌂', '◍', '◈', '⚑', '✦', '⟡']

export const summaryStats = [
  { label: 'Rendimiento', value: '87.4', delta: '+6.2%', tone: 'green' },
  { label: 'Partidos', value: '346', delta: '+14', tone: 'neutral' },
  { label: 'Posiciones', value: '4', delta: 'Flex', tone: 'blue' },
  { label: 'Carrera', value: '6', delta: 'Temporadas', tone: 'violet' },
]

export const filtersSummary = [
  { label: 'Segundo delantero', value: '34' },
  { label: 'Pierna derecha', value: 'Hábil' },
  { label: 'Altura', value: '1.76 mts' },
  { label: 'Valor de mercado', value: '$6.8M' },
]

export const comparisonMetrics = [
  { key: 'Goals', label: 'Goles' },
  { key: 'Assists', label: 'Asistencias' },
  { key: 'Passes', label: 'Pases completados' },
  { key: 'Tackles', label: 'Duelos defensivos ganados' },
  { key: 'AerialDuels', label: 'Duelos aéreos ganados' },
  { key: 'Minutes', label: 'Minutos jugados' },
]

export const comparisonRows = [
  { label: 'Recuperaciones', values: [15, 91, 33] },
  { label: 'Acciones defensivas exitosas', values: [14, 35, 28] },
  { label: 'Duelos aéreos ganados', values: [22, 25, 74] },
  { label: '% de pases completados', values: [80, 87, 90] },
  { label: 'Duelos defensivos ganados', values: [69, 57, 96] },
  { label: 'Asistencias esperadas (xA)', values: [0.52, 0.16, 0.41] },
  { label: 'Asistencias', values: [5, 9, 1] },
]

export function getAgeRange(age: number) {
  if (age <= 21) return '18-21'
  if (age <= 25) return '22-25'
  if (age <= 29) return '26-29'
  return '30+'
}

export function normalizeMetricValue(key: string, value: number) {
  if (key === 'Minutes') return Math.round(value / 60)
  return value
}
