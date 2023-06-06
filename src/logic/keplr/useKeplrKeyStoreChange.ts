import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { connectKeplr } from 'src/logic/keplr/keplr'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'
import { WALLETS_NAME } from 'src/logic/wallets/constant/wallets'
import { loadLastUsedProvider } from 'src/logic/wallets/store/middlewares/providerWatcher'
import { JWT_TOKEN_KEY } from 'src/services/constant/common'
import session from 'src/utils/storage/session'

const useKeplrKeyStoreChange = (): void => {
  const dispatch = useDispatch<Dispatch>()

  useEffect(() => {
    const onKeplrKeyStoreChange = () => {
      loadLastUsedProvider().then((lastUsedProvider) => {
        if (lastUsedProvider === WALLETS_NAME.Keplr) {
          session.removeItem(JWT_TOKEN_KEY)
          connectKeplr()
        }
      })
    }

    window.addEventListener('keplr_keystorechange', onKeplrKeyStoreChange)

    return () => {
      window.removeEventListener('keplr_keystorechange', onKeplrKeyStoreChange)
    }
  }, [dispatch])
}

export default useKeplrKeyStoreChange
