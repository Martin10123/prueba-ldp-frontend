import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Loader2, X } from 'lucide-react'
import type { CreatePlayerInput, PlayerListItem, PlayerOptions, UpdatePlayerInput } from '../../types/player'
import { getPositionLabel } from '../../utils/playerPosition'

type PlayerFormValues = {
    name: string
    birthDate?: string
    nationality: string
    position: CreatePlayerInput['position']
    photoUrl: string
    currentTeamId: string
}

const defaultValues: PlayerFormValues = {
    name: '',
    birthDate: '',
    nationality: '',
    position: '',
    photoUrl: '',
    currentTeamId: '',
}

const toDateInput = (value: string) => {
    if (!value) return ''

    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return ''
    return parsed.toISOString().slice(0, 10)
}

type PlayerFormModalProps = {
    open: boolean
    mode: 'create' | 'edit'
    player: PlayerListItem | null
    options: PlayerOptions
    optionsLoading: boolean
    isSubmitting: boolean
    onClose: () => void
    onSubmit: (input: CreatePlayerInput | UpdatePlayerInput) => Promise<void>
}

export const PlayerFormModal = ({
    open,
    mode,
    player,
    options,
    optionsLoading,
    isSubmitting,
    onClose,
    onSubmit,
}: PlayerFormModalProps) => {
    const form = useForm<PlayerFormValues>({
        defaultValues,
    })

    useEffect(() => {
        if (!open) return

        if (mode === 'edit' && player) {
            form.reset({
                name: player.name,
                birthDate: toDateInput(player.birthDate),
                nationality: player.nationality,
                position: player.position,
                photoUrl: player.photoUrl,
                currentTeamId: player.currentTeamId || '',
            })
            return
        }

        form.reset({
            ...defaultValues,
            position: options.positions[0] ?? '',
            nationality: options.nationalities[0] ?? '',
            currentTeamId: options.teams[0]?.id ?? '',
        })
    }, [form, mode, open, options.nationalities, options.positions, options.teams, player])

    if (!open) return null

    const submit = form.handleSubmit(async (values) => {
        const basePayload = {
            name: values.name.trim(),
            nationality: values.nationality.trim(),
            position: values.position,
            photoUrl: values.photoUrl.trim(),
            currentTeamId: values.currentTeamId.trim(),
        }

        if (mode === 'create') {
            if (!values.birthDate) return

            const parsedBirthDate = new Date(values.birthDate)
            if (Number.isNaN(parsedBirthDate.getTime())) return

            await onSubmit({
                ...basePayload,
                birthDate: parsedBirthDate.toISOString(),
            })
            return
        }

        await onSubmit(basePayload)
    })

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
            <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#111111] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-xl font-bold">{mode === 'create' ? 'Crear jugador' : 'Editar jugador'}</h3>
                        <p className="mt-1 text-sm text-white/60">
                            {mode === 'create'
                                ? 'Completa la información del nuevo jugador.'
                                : 'Actualiza la información del jugador seleccionado.'}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                    >
                        <X size={16} />
                    </button>
                </div>

                <form className="grid gap-3" onSubmit={submit}>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <label className={`block ${mode === 'create' ? 'sm:col-span-2' : ''}`}>
                            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/45">Nombre</span>
                            <input
                                className="w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#00E094]/40"
                                {...form.register('name', { required: true, minLength: 2 })}
                            />
                        </label>
                        {mode === 'create' ? (
                            <label className="block">
                                <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/45">Nacimiento</span>
                                <input
                                    type="date"
                                    className="w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#00E094]/40"
                                    {...form.register('birthDate', { required: true })}
                                />
                            </label>
                        ) : null}
                        <label className="block">
                            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/45">Posición</span>
                            <select
                                disabled={optionsLoading || options.positions.length === 0}
                                className="w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#00E094]/40"
                                {...form.register('position', { required: true })}
                            >
                                <option value="">
                                    {optionsLoading ? 'Cargando posiciones...' : 'Selecciona una posición'}
                                </option>
                                {options.positions.map((position) => (
                                    <option key={position} value={position}>
                                        {position} - {getPositionLabel(position)}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block">
                            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/45">Nacionalidad</span>
                            <select
                                disabled={optionsLoading || options.nationalities.length === 0}
                                className="w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#00E094]/40"
                                {...form.register('nationality', { required: true })}
                            >
                                <option value="">
                                    {optionsLoading ? 'Cargando nacionalidades...' : 'Selecciona una nacionalidad'}
                                </option>
                                {options.nationalities.map((nationality) => (
                                    <option key={nationality} value={nationality}>
                                        {nationality}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="block">
                            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/45">Equipo</span>
                            <select
                                disabled={optionsLoading || options.teams.length === 0}
                                className="w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#00E094]/40"
                                {...form.register('currentTeamId', { required: true })}
                            >
                                <option value="">
                                    {optionsLoading ? 'Cargando equipos...' : 'Selecciona un equipo'}
                                </option>
                                {options.teams.map((team) => (
                                    <option key={team.id} value={team.id}>
                                        {team.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <label className="block">
                        <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/45">URL foto</span>
                        <input
                            className="w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#00E094]/40"
                            placeholder="https://..."
                            {...form.register('photoUrl', { required: true })}
                        />
                    </label>

                    <div className="mt-2 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/10"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#00E094] px-4 py-2 text-sm font-bold text-black transition hover:brightness-110 disabled:opacity-60"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : null}
                            {mode === 'create' ? 'Crear' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}