import { useState, useCallback } from 'react'

interface UsePaginationProps {
  initialPage?: number
  initialLimit?: number
  totalItems?: number
}

export function usePagination({ 
  initialPage = 1, 
  initialLimit = 12,
  totalItems = 0 
}: UsePaginationProps = {}) {
  const [page, setPage] = useState(initialPage)
  const [limit] = useState(initialLimit)

  const totalPages = Math.ceil(totalItems / limit)

  const nextPage = useCallback(() => {
    setPage(p => Math.min(p + 1, totalPages))
  }, [totalPages])

  const prevPage = useCallback(() => {
    setPage(p => Math.max(p - 1, 1))
  }, [])

  const goToPage = useCallback((pageNum: number) => {
    setPage(Math.max(1, Math.min(pageNum, totalPages)))
  }, [totalPages])

  const reset = useCallback(() => {
    setPage(1)
  }, [])

  return {
    page,
    limit,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    reset
  }
}