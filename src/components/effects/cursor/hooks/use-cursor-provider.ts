'use client'

import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useEffectEvent, useLayoutEffect, useMemo, useState } from 'react'

import type {
  CursorConfig,
  CursorContextValue,
  CursorInternalState
} from '../types'

const DEFAULT_CURSOR_STATE: CursorInternalState = {
  state: 'default',
  config: {},
}

export type UseCursorProviderReturn = {
  contextValue: CursorContextValue
  isMounted: boolean
  cursorState: CursorInternalState
}

/**
 * Encapsulates cursor provider state, controls, and document pointer listeners.
 * Use inside CursorProvider to keep the component thin and testable.
 */
export function useCursorProvider(): UseCursorProviderReturn {
  const pathname = usePathname()
  const [cursorState, setCursorState] = useState<CursorInternalState>(DEFAULT_CURSOR_STATE)
  const [isMounted, setIsMounted] = useState(false)

  useLayoutEffect(() => {
    setIsMounted(true)
  }, [])

  const setDefault = useCallback(() => {
    setCursorState(DEFAULT_CURSOR_STATE)
  }, [])

  useEffect(() => {
    setDefault()
  }, [pathname, setDefault])

  const setHover = useCallback((config: CursorConfig = {}) => {
    setCursorState({
      state: 'hover',
      config,
    })
  }, [])

  const hide = useCallback(() => {
    setCursorState({
      state: 'hidden',
      config: {},
    })
  }, [])

  const show = useCallback(() => {
    setCursorState((prev) => ({
      ...prev,
      state: prev.state === 'hidden' ? 'default' : prev.state,
    }))
  }, [])

  const onPointerOut = useEffectEvent((e: PointerEvent) => {
    if (!e.relatedTarget || !document.documentElement.contains(e.relatedTarget as Node)) {
      hide()
    }
  })

  const onPointerOver = useEffectEvent(() => {
    show()
  })

  useEffect(() => {
    document.addEventListener('pointerout', onPointerOut)
    document.addEventListener('pointerover', onPointerOver)
    return () => {
      document.removeEventListener('pointerout', onPointerOut)
      document.removeEventListener('pointerover', onPointerOver)
    }
  }, [])

  const contextValue = useMemo<CursorContextValue>(
    () => ({
      cursorState,
      setHover,
      setDefault,
      hide,
      show,
    }),
    [cursorState, setHover, setDefault, hide, show]
  )

  return {
    contextValue,
    isMounted,
    cursorState,
  }
}
