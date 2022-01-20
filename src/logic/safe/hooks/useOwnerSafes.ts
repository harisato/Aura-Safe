import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { currentChainId } from 'src/logic/config/store/selectors'
import useCachedState from 'src/utils/storage/useCachedState'
import { fetchMSafesByOwner } from '../../../services'

type OwnedSafesCache = Record<string, Record<string, string[]>>

const storageKey = 'ownedSafes'

const useOwnerSafes = (): Record<string, string[]> => {
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
        const safes = await fetchMSafesByOwner(connectedWalletAddress)

        // Loading Safe with status created
        const safesAdress: string[] = safes.map(e => e.safeAddress).filter(Boolean)

        setCache((prev = {}) => ({
          ...prev,
          [connectedWalletAddress]: {
            ...(prev[connectedWalletAddress] || {}),
            [chainId]: safesAdress,
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

export default useOwnerSafes
