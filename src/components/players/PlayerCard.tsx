import { Pencil, Trash2, UserRound } from 'lucide-react'
import type { PlayerListItem } from '../../types/player'
import { getPositionLabel } from '../../utils/playerPosition'

const getAge = (birthDate: string) => {
  const birth = new Date(birthDate)
  if (Number.isNaN(birth.getTime())) return null

  const ageDate = new Date(Date.now() - birth.getTime())
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))

type PlayerCardProps = {
  player: PlayerListItem
  onOpenProfile: (player: PlayerListItem) => void
  onEdit: (player: PlayerListItem) => void
  onDelete: (player: PlayerListItem) => void
}

export const PlayerCard = ({ player, onOpenProfile, onEdit, onDelete }: PlayerCardProps) => {
  const age = getAge(player.birthDate)
  const positionLabel = getPositionLabel(player.position)
  const initials = player.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpenProfile(player)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpenProfile(player)
        }
      }}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-[#111111] transition hover:cursor-pointer hover:border-white/20 hover:bg-[#141414]"
    >
      <div className="grid gap-4 p-4 sm:grid-cols-[112px_1fr]">
        <div className="relative h-36 overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:h-28">
          {player.photoUrl ? (
            <img alt={player.name} src={player.photoUrl} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center bg-linear-to-br from-[#00E094]/20 to-[#0C65D4]/20 text-2xl font-black text-white/80">
              {initials || <UserRound size={28} />}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold">{player.name}</h3>
              <p className="mt-1 text-sm text-white/60">{positionLabel}</p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80">
              {positionLabel}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/70">
            <span className="rounded-full bg-white/10 px-2 py-1">{player.nationality || 'Sin nacionalidad'}</span>
            <span className="rounded-full bg-white/10 px-2 py-1">{age ? `${age} años` : 'Edad no disponible'}</span>
            <span className="rounded-full bg-white/10 px-2 py-1">Club: {player.currentTeamName || 'Sin equipo'}</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-white/65">
            <p>
              <span className="text-white/45">Nacimiento: </span>
              {formatDate(player.birthDate)}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onEdit(player)
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/80 transition hover:border-white/20 hover:bg-white/10"
              >
                <Pencil size={14} />
                Editar
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onDelete(player)
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-red-400/20 bg-red-500/10 px-2.5 py-1.5 text-xs text-red-100 transition hover:bg-red-500/20"
              >
                <Trash2 size={14} />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}