import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sileo } from 'sileo'
import type { CreatePlayerInput, UpdatePlayerInput } from '../types/player'
import { createPlayer, deletePlayer, updatePlayer } from '../services/players'

export const usePlayerCrud = () => {
  const queryClient = useQueryClient()

  const invalidatePlayers = async () => {
    await queryClient.invalidateQueries({ queryKey: ['players'] })
  }

  const onCreatePlayer = useMutation({
    mutationFn: (input: CreatePlayerInput) => createPlayer(input),
    onSuccess: async () => {
      await invalidatePlayers()
      sileo.success({
        title: 'Jugador creado',
        description: 'El jugador fue creado correctamente.',
      })
    },
    onError: (error) => {
      sileo.error({
        title: 'No se pudo crear',
        description: error instanceof Error ? error.message : 'Error inesperado',
      })
    },
  })

  const onUpdatePlayer = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePlayerInput }) => updatePlayer(id, input),
    onSuccess: async () => {
      await invalidatePlayers()
      sileo.success({
        title: 'Jugador actualizado',
        description: 'Los cambios se guardaron correctamente.',
      })
    },
    onError: (error) => {
      sileo.error({
        title: 'No se pudo actualizar',
        description: error instanceof Error ? error.message : 'Error inesperado',
      })
    },
  })

  const onDeletePlayer = useMutation({
    mutationFn: (id: string) => deletePlayer(id),
    onSuccess: async () => {
      await invalidatePlayers()
      sileo.success({
        title: 'Jugador eliminado',
        description: 'El jugador se eliminó correctamente.',
      })
    },
    onError: (error) => {
      sileo.error({
        title: 'No se pudo eliminar',
        description: error instanceof Error ? error.message : 'Error inesperado',
      })
    },
  })

  return {
    onCreatePlayer,
    onUpdatePlayer,
    onDeletePlayer,
  }
}