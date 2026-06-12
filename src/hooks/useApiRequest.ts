import axios from 'axios'
import { useCallback, useEffect, useReducer, useRef } from 'react'
import { getErrorMessage } from '../utils/getErrorMessage'

type State<T> = {
  loading: boolean
  error: string
  data: T | null
}

type Action<T> = { type: 'start' } | { type: 'success'; data: T } | { type: 'error'; error: string }

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'start':
      return { ...state, loading: true, error: '' }
    case 'success':
      return { loading: false, error: '', data: action.data }
    case 'error':
      return { ...state, loading: false, error: action.error }
  }
}

const initialState = { loading: false, error: '', data: null }

/**
 * Quản lý vòng đời của một API call: loading / error / data.
 * Dùng chung cho mọi service async, không riêng login.
 *
 * `fn` nhận một `AbortSignal`: truyền nó xuống service (axios) để request cũ bị huỷ
 * khi `run` được gọi lại (vd: search-as-you-type) hoặc khi component unmount.
 *
 * @example
 * const { loading, error, run } = useApiRequest<LoginResponse>()
 * const result = await run((signal) => authService.login(username, password, signal), 'Đăng nhập thất bại.')
 */
export function useApiRequest<T>() {
  const [state, dispatch] = useReducer(reducer<T>, initialState as State<T>)
  // Controller của request đang bay; mỗi lần run sẽ huỷ cái trước rồi tạo cái mới.
  const controllerRef = useRef<AbortController | null>(null)

  /** Chạy một async function; tự set loading/error/data. Trả về data nếu thành công, undefined nếu lỗi. */
  const run = useCallback(
    async (fn: (signal: AbortSignal) => Promise<T>, fallbackMessage?: string) => {
      // Huỷ request trước đó còn đang chờ -> tránh response cũ ghi đè response mới.
      controllerRef.current?.abort()
      const controller = new AbortController()
      controllerRef.current = controller

      dispatch({ type: 'start' })
      try {
        const data = await fn(controller.signal)
        dispatch({ type: 'success', data })
        return data
      } catch (err) {
        // Request bị huỷ (gõ tiếp / unmount) không phải lỗi -> giữ nguyên trạng thái, bỏ qua.
        if (axios.isCancel(err) || controller.signal.aborted) return undefined
        console.error(err)
        dispatch({ type: 'error', error: getErrorMessage(err, fallbackMessage) })
        return undefined
      }
    },
    []
  )

  // Huỷ request đang bay khi component unmount.
  useEffect(() => () => controllerRef.current?.abort(), [])

  /** Đặt lỗi thủ công (vd: lỗi validate phía client, không qua request). */
  const setError = useCallback((message: string) => {
    dispatch({ type: 'error', error: message })
  }, [])

  return { ...state, run, setError }
}
