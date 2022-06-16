import { BigNumber } from 'bignumber.js'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import Root from 'src/components/Root'
import { SENTRY_DSN } from './utils/constants'
import { disableMMAutoRefreshWarning } from './utils/mm_warnings'
import { getChainOptions, WalletProvider } from '@terra-money/wallet-provider'

disableMMAutoRefreshWarning()

BigNumber.set({ EXPONENTIAL_AT: [-7, 255] })

Sentry.init({
  dsn: SENTRY_DSN,
  release: `aura-safe@${process.env.REACT_APP_APP_VERSION}`,
  integrations: [new Integrations.BrowserTracing()],
  sampleRate: 0.1,
  // ignore MetaMask errors we don't control
  ignoreErrors: ['Internal JSON-RPC error', 'JsonRpcEngine', 'Non-Error promise rejection captured with keys: code'],
})

const root = document.getElementById('root')

if (root !== null) {
  getChainOptions().then((chainOptions) => {
    ReactDOM.render(
      <WalletProvider {...chainOptions}>
        <Root />
      </WalletProvider>,
      root,
    )
  })
}
