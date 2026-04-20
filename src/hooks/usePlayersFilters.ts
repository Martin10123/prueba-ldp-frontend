import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import type { ApiPlayerPosition, PlayersQueryFilters } from '../types/player'

const LIMIT_OPTIONS = [10, 20, 50] as const

const parseNumberInput = (value: string) => {
  if (value.trim() === '') return undefined

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

export type PlayersFilterState = {
  search: string
  setSearch: (value: string) => void
  position: ApiPlayerPosition | 'ALL'
  setPosition: (value: ApiPlayerPosition | 'ALL') => void
  nationality: string
  setNationality: (value: string) => void
  minAge: string
  setMinAge: (value: string) => void
  maxAge: string
  setMaxAge: (value: string) => void
  page: number
  setPage: (value: number | ((current: number) => number)) => void
  limit: (typeof LIMIT_OPTIONS)[number]
  setLimit: (value: (typeof LIMIT_OPTIONS)[number]) => void
  filters: PlayersQueryFilters
  clearFilters: () => void
}

export const playersLimitOptions = LIMIT_OPTIONS

export const usePlayersFilters = (): PlayersFilterState => {
  const [search, setSearch] = useState('')
  const [position, setPosition] = useState<ApiPlayerPosition | 'ALL'>('ALL')
  const [nationality, setNationality] = useState('')
  const [minAge, setMinAge] = useState('')
  const [maxAge, setMaxAge] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState<(typeof LIMIT_OPTIONS)[number]>(10)

  const deferredSearch = useDeferredValue(search.trim())

  useEffect(() => {
    setPage(1)
  }, [deferredSearch, position, nationality, minAge, maxAge, limit])

  const filters = useMemo<PlayersQueryFilters>(
    () => ({
      search: deferredSearch || undefined,
      position: position === 'ALL' ? undefined : position,
      nationality: nationality.trim() || undefined,
      minAge: parseNumberInput(minAge),
      maxAge: parseNumberInput(maxAge),
      page,
      limit,
    }),
    [deferredSearch, limit, maxAge, minAge, nationality, page, position],
  )

  const clearFilters = () => {
    setSearch('')
    setPosition('ALL')
    setNationality('')
    setMinAge('')
    setMaxAge('')
    setPage(1)
    setLimit(10)
  }

  return {
    search,
    setSearch,
    position,
    setPosition,
    nationality,
    setNationality,
    minAge,
    setMinAge,
    maxAge,
    setMaxAge,
    page,
    setPage,
    limit,
    setLimit,
    filters,
    clearFilters,
  }
}