import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import addViewedSafe from 'src/logic/currentSession/store/actions/addViewedSafe'
import { fetchMSafe } from 'src/logic/safe/store/actions/fetchSafe'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'
import { currentChainId } from 'src/logic/config/store/selectors'
import { currentSafe } from '../store/selectors'
import { currentSafeWithNames } from '../store/selectors'

export const useLoadSafe = (safeAddress?: string, safeId?: number): void => {
  const dispatch = useDispatch<Dispatch>()
  const chainId = useSelector(currentChainId)
  useEffect(() => {
    if (!safeAddress || !safeId) return
    dispatch(fetchMSafe(safeAddress, safeId, true))

    // dispatch(fetchLatestMasterContractVersion())
    // dispatch(fetchSafe(safeAddress, true))
    // dispatch(updateAvailableCurrencies())
    dispatch(addViewedSafe(safeAddress, String(safeId)))
  }, [dispatch, safeAddress, chainId, safeId])
}
