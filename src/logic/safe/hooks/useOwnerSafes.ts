import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { currentChainId } from 'src/logic/config/store/selectors'
import useCachedState from 'src/utils/storage/useCachedState'
import { fetchMSafesByOwner } from 'src/services'
import { getInternalChainId } from 'src/config'


type OwnedSafesCache = Record<string, Record<string, SafeType[]>>

const storageKey = 'ownedSafes'

const useOwnerSafes = (): Record<string, SafeType[]> => {
  const connectedWalletAddress = useSelector(userAccountSelector)
  const chainId = useSelector(currentChainId)
  const [cache = {}, setCache] = useCachedState<OwnedSafesCache>(storageKey)
  const ownerSafes = cache[connectedWalletAddress] || {}

  useEffect(() => {
    if (!connectedWalletAddress) {
      return
    }

    const load = async () => {
      try {
        const internalChainId = getInternalChainId();
        const safes = await fetchMSafesByOwner(connectedWalletAddress, internalChainId)

        // Loading Safe with status created
        const safe: SafeType[] = safes.map(safe => safe as SafeType)

        setCache((prev = {}) => ({
          ...prev,
          [connectedWalletAddress]: {
            ...(prev[connectedWalletAddress] || {}),
            [chainId]: safe,
          },
        }))
      } catch (err) {
        logError(Errors._610, err.message)
      }
    }

    load()
  }, [chainId, connectedWalletAddress, setCache])

  return ownerSafes
}


export enum SafeStatus {
  Created = 'created',
  Pending = 'pending',
  NeedConfirm = 'needConfirm',
  Confirmed = 'confirmed',
  Deleted = 'deleted'
}

export type SafeType = {
  safeAddress: string,
  creatorAddress: string,
  status: SafeStatus
  id: number,
  ownerAddress?: string,
  ownerPubkey?: string,
}

export default useOwnerSafes
