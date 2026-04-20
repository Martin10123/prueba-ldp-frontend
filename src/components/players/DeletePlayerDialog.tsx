import { Loader2, TriangleAlert, X } from 'lucide-react'

type DeletePlayerDialogProps = {
  open: boolean
  playerName: string
  loading: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

export const DeletePlayerDialog = ({
  open,
  playerName,
  loading,
  onClose,
  onConfirm,
}: DeletePlayerDialogProps) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-red-400/20 bg-[#111111] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-2 text-red-100">
              <TriangleAlert size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Eliminar jugador</h3>
              <p className="mt-1 text-sm text-white/60">
                Esta acción eliminará a <strong>{playerName}</strong> y no se puede deshacer.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/10"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              void onConfirm()
            }}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/25 disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" size={14} /> : null}
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}