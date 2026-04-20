import type { ApiPlayerPosition } from '../types/player'

export const POSITION_OPTIONS: Array<{ value: ApiPlayerPosition; label: string }> = [
  { value: 'GK', label: 'GK - Arquero' },
  { value: 'CB', label: 'CB - Central' },
  { value: 'RB', label: 'RB - Lateral derecho' },
  { value: 'LB', label: 'LB - Lateral izquierdo' },
  { value: 'CDM', label: 'CDM - Mediocentro defensivo' },
  { value: 'CM', label: 'CM - Mediocentro' },
  { value: 'CAM', label: 'CAM - Mediocentro ofensivo' },
  { value: 'RW', label: 'RW - Extremo derecho' },
  { value: 'LW', label: 'LW - Extremo izquierdo' },
  { value: 'ST', label: 'ST - Delantero' },
]

export const POSITION_LABEL_BY_CODE: Record<ApiPlayerPosition, string> = {
  GK: 'Arquero',
  CB: 'Defensor central',
  RB: 'Lateral derecho',
  LB: 'Lateral izquierdo',
  CDM: 'Mediocentro defensivo',
  CM: 'Mediocentro',
  CAM: 'Mediocentro ofensivo',
  RW: 'Extremo derecho',
  LW: 'Extremo izquierdo',
  ST: 'Delantero',
}

export const getPositionLabel = (position: ApiPlayerPosition) => POSITION_LABEL_BY_CODE[position] ?? position