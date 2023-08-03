import { Loader } from '@aura/safe-react-components'
import * as Sentry from '@sentry/react'
import { useEffect, useState } from 'react'

import { MuiThemeProvider } from '@material-ui/core/styles'
import { Provider, useDispatch } from 'react-redux'
import { Router } from 'react-router'
import App from 'src/App'
import GlobalErrorBoundary from 'src/components/GlobalErrorBoundary'
import { LoadingContainer } from 'src/components/LoaderContainer'
import StoreMigrator from 'src/components/StoreMigrator'
import { isValidChainId, LOCAL_CONFIG_KEY, _getChainId, _setChainId } from 'src/config'
import { loadChains } from 'src/config/cache/chains'
import { ConfigState } from 'src/logic/config/store/reducer/reducer'
import { setChainId } from 'src/logic/config/utils'
import { CodedException, Errors, logError } from 'src/logic/exceptions/CodedException'
import { TermProvider } from 'src/logic/TermContext/index'
import AppRoutes from 'src/routes'
import { history, WELCOME_ROUTE } from 'src/routes/routes'
import { setBaseUrl, setEnv, setGithubPageTokenRegistryUrl } from 'src/services'
import { getGatewayUrl } from 'src/services/data/environment'
import { store } from 'src/logic/safe/store'
import theme from 'src/theme/mui'
import { DEFAULT_CHAIN_ID } from 'src/utils/constants'
import local from 'src/utils/storage/local'
import { wrapInSuspense } from 'src/utils/wrapInSuspense'
import { ThemeProvider } from 'styled-components'
import './index.module.scss'
import './KeystoneCustom.module.scss'
import LegacyRouteRedirection from './LegacyRouteRedirection'
import './OnboardCustom.module.scss'
import { pyxisTheme } from 'src/theme/styledComponentsTheme'
import { setEnvironmentAction } from 'src/logic/config/store/actions'
// Preloader is rendered outside of '#root' and acts as a loading spinner
// for the app and then chains loading
const removePreloader = () => {
  document.getElementById('safe-preloader-animation')?.remove()
}

const RootConsumer = (): React.ReactElement | null => {
  const [gatewayUrl, setGatewayUrl] = useState<string>('')
  const [hasChains, setHasChains] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const initGateway = async () => {
      try {
        const gateway = await getGatewayUrl()
        if (!gateway) {
          setIsError(true)
          return
        }
        const { chainId, apiGateway, env } = gateway

        const localItem = local.getItem<ConfigState>(LOCAL_CONFIG_KEY)

        if (chainId) {
          setChainId(localItem?.chainId || chainId)
        }

        if (apiGateway) {
          setBaseUrl(apiGateway)
          setEnv(env || 'development')
          dispatch(setEnvironmentAction((env || 'development') as 'production' | 'development'))
          setGithubPageTokenRegistryUrl(`https://aura-nw.github.io/token-registry/${chainId}.json`)
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
    <ThemeProvider theme={pyxisTheme}>
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <Router history={history}>
            <Sentry.ErrorBoundary fallback={GlobalErrorBoundary}>
              <TermProvider>
                <RootConsumer />
              </TermProvider>
            </Sentry.ErrorBoundary>
          </Router>
        </MuiThemeProvider>
      </Provider>
    </ThemeProvider>
  </>
)

export default Root
