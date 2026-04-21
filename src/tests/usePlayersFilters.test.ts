import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { usePlayersFilters } from '../hooks/usePlayersFilters'

describe('usePlayersFilters', () => {
  it('construye filtros desde el estado y reinicia con clearFilters', async () => {
    const { result } = renderHook(() => usePlayersFilters())

    act(() => {
      result.current.setSearch('  Messi  ')
      result.current.setPosition('GK')
      result.current.setNationality('Argentina')
      result.current.setMinAge('20')
      result.current.setMaxAge('35')
      result.current.setPage(3)
      result.current.setLimit(50)
    })

    await waitFor(() => {
      expect(result.current.filters.search).toBe('Messi')
      expect(result.current.filters.position).toBe('GK')
      expect(result.current.filters.nationality).toBe('Argentina')
      expect(result.current.filters.minAge).toBe(20)
      expect(result.current.filters.maxAge).toBe(35)
      expect(result.current.filters.page).toBe(1)
      expect(result.current.filters.limit).toBe(50)
    })

    act(() => {
      result.current.clearFilters()
    })

    await waitFor(() => {
      expect(result.current.filters.search).toBeUndefined()
      expect(result.current.filters.position).toBeUndefined()
      expect(result.current.filters.nationality).toBeUndefined()
      expect(result.current.filters.minAge).toBeUndefined()
      expect(result.current.filters.maxAge).toBeUndefined()
      expect(result.current.filters.page).toBe(1)
      expect(result.current.filters.limit).toBe(10)
    })
  })
})
