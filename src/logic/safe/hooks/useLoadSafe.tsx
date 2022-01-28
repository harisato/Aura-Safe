import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import addViewedSafe from 'src/logic/currentSession/store/actions/addViewedSafe'
import { fetchMSafe } from 'src/logic/safe/store/actions/fetchSafe'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'
import { updateAvailableCurrencies } from 'src/logic/currencyValues/store/actions/updateAvailableCurrencies'
import { currentChainId } from 'src/logic/config/store/selectors'
import { fetchSafeTokens, fetchMSafeTokens } from 'src/logic/tokens/store/actions/fetchSafeTokens'

export const useLoadSafe = (safeAddress?: string, safeId?: string): void => {
  const dispatch = useDispatch<Dispatch>()
  const chainId = useSelector(currentChainId)

  useEffect(() => {
    if (!safeAddress) return

    dispatch(fetchMSafe(safeAddress, String(safeId), true))

    // dispatch(fetchLatestMasterContractVersion())
    // dispatch(fetchSafe(safeAddress, true))
    // dispatch(updateAvailableCurrencies())
    dispatch(addViewedSafe(safeAddress))
  }, [dispatch, safeAddress, chainId])
}
