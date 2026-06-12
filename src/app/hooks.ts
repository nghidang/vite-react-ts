import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'

// Pre-typed hooks — dùng thay cho useDispatch/useSelector gốc để có sẵn type
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
