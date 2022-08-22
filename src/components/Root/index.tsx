import * as Sentry from '@sentry/react'
import { theme as styledTheme, Loader } from '@aura/safe-react-components'
import { useEffect, useState } from 'react'

import { LoadingContainer } from 'src/components/LoaderContainer'
import App from 'src/components/App'
import GlobalErrorBoundary from 'src/components/GlobalErrorBoundary'
import AppRoutes from 'src/routes'
import { store } from 'src/store'
import { history, WELCOME_ROUTE } from 'src/routes/routes'
import theme from 'src/theme/mui'
import { wrapInSuspense } from 'src/utils/wrapInSuspense'
import Providers from '../Providers'
import './index.module.scss'
import './OnboardCustom.module.scss'
import './KeystoneCustom.module.scss'
import StoreMigrator from 'src/components/StoreMigrator'
import LegacyRouteRedirection from './LegacyRouteRedirection'
import { logError, Errors, CodedException } from 'src/logic/exceptions/CodedException'
import { loadChains } from 'src/config/cache/chains'
import { isValidChainId, LOCAL_CONFIG_KEY, _getChainId, _setChainId } from 'src/config'
import { DEFAULT_CHAIN_ID } from 'src/utils/constants'
import { setChainId } from 'src/logic/config/utils'
import { getGatewayUrl } from 'src/services/data/environment'
import { setBaseUrl } from 'src/services'
import local from 'src/utils/storage/local'
import { ConfigState } from 'src/logic/config/store/reducer/reducer'

// Preloader is rendered outside of '#root' and acts as a loading spinner
// for the app and then chains loading
const removePreloader = () => {
  document.getElementById('safe-preloader-animation')?.remove()
}

const RootConsumer = (): React.ReactElement | null => {
  const [gatewayUrl, setGatewayUrl] = useState<string>('')
  const [hasChains, setHasChains] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    const initGateway = async () => {
      try {
        const gateway = await getGatewayUrl()
        if (!gateway) {
          setIsError(true)
          return
        }
        const { chainId, apiGateway } = gateway

        const localItem = local.getItem<ConfigState>(LOCAL_CONFIG_KEY)

        if (chainId) {
          _setChainId(localItem?.chainId || chainId)
        }

        if (apiGateway) {
          setBaseUrl(apiGateway)
          setGatewayUrl(apiGateway)
        } else {
          setIsError(true)
        }
      } catch (err) {
        console.error(err)
        setIsError(true)
      }
    }
    initGateway()
  }, [])

  useEffect(() => {
    if (!gatewayUrl) {
      return
    }

    const initChains = async () => {
      await loadChains()
      try {
        const _isValidChainId = !isValidChainId(_getChainId())
        if (_isValidChainId) {
          setChainId(DEFAULT_CHAIN_ID)
          history.push(WELCOME_ROUTE)
        }

        setHasChains(true)
      } catch (err) {
        logError(Errors._904, err.message)
        setIsError(true)
      }
    }

    initChains()
  }, [gatewayUrl])

  // Chains failed to load
  if (isError) {
    removePreloader()
    throw new CodedException(Errors._904)
  }

  if (!hasChains) {
    return null
  }

  removePreloader()

  return (
    <App>
      {wrapInSuspense(
        <AppRoutes />,
        <LoadingContainer>
          <Loader size="md" />
        </LoadingContainer>,
      )}
      <StoreMigrator />
    </App>
  )
}

// Chains loader requires error boundary, which requires Providers
// and Legacy redirection should be outside of Providers
const Root = (): React.ReactElement => (
  <>
    <LegacyRouteRedirection history={history} />
    <Providers store={store} history={history} styledTheme={styledTheme} muiTheme={theme}>
      <Sentry.ErrorBoundary fallback={GlobalErrorBoundary}>
        <RootConsumer />
      </Sentry.ErrorBoundary>
    </Providers>
  </>
)

export default Root
