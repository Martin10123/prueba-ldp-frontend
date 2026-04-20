import type { ApiPlayerPosition } from '../types/player'

export const POSITION_LABEL_BY_CODE: Record<string, string> = {
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