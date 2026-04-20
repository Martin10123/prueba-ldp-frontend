import type { PlayerListItem } from '../../types/player'

type ComparePlayerSelectorProps = {
  options: PlayerListItem[]
  selectedIds: string[]
  showThird: boolean
  loading: boolean
  onSelect: (index: number, playerId: string) => void
  onToggleThird: () => void
}

const selectClass =
  'w-full rounded-xl border border-white/10 bg-[#111111] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#00E094]/35'

export const ComparePlayerSelector = ({
  options,
  selectedIds,
  showThird,
  loading,
  onSelect,
  onToggleThird,
}: ComparePlayerSelectorProps) => {
  const maxSelectors = showThird ? 3 : 2

  return (
    <div className="grid gap-3">
      <div className="grid gap-3 md:grid-cols-[repeat(2,minmax(0,1fr))_auto] lg:grid-cols-[repeat(3,minmax(0,1fr))_auto]">
        {Array.from({ length: maxSelectors }).map((_, index) => (
          <label key={`compare-selector-${index}`} className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/45">
              Jugador {index + 1}
            </span>
            <select
              value={selectedIds[index] ?? ''}
              onChange={(event) => onSelect(index, event.target.value)}
              className={selectClass}
              disabled={loading}
            >
              {options.map((player) => {
                const isUsedByOther = selectedIds.some((id, idIndex) => id === player.id && idIndex !== index)

                return (
                  <option key={player.id} value={player.id} disabled={isUsedByOther}>
                    {player.name} · {player.currentTeamName || 'Sin equipo'}
                  </option>
                )
              })}
            </select>
          </label>
        ))}

        <button
          type="button"
          onClick={onToggleThird}
          disabled={loading || options.length < 3}
          className="h-fit self-end rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {showThird ? 'Comparar solo 2' : '+ Agregar 3ro'}
        </button>
      </div>

      {options.length < 2 ? (
        <p className="text-sm text-amber-200/80">Se requieren al menos 2 jugadores disponibles para comparar.</p>
      ) : null}
    </div>
  )
}
