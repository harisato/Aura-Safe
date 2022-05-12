import { ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk'

type ChainName = ChainInfo['chainName']
export type ShortName = ChainInfo['shortName']

// Remain agnostic and follow CGW by using the following
export type ChainId = ChainInfo['chainId']

// Only use the following for edge cases
export const CHAIN_ID: Record<ChainName, ChainId> = {
  UNKNOWN: '0',
  ETHEREUM: '1',
  MORDEN: '2',
  ROPSTEN: '3',
  RINKEBY: '4',
  GOERLI: '5',
  OPTIMISM: '10',
  KOVAN: '42',
  BSC: '56',
  XDAI: '100',
  POLYGON: '137',
  ENERGY_WEB_CHAIN: '246',
  LOCAL: '4447',
  ARBITRUM: '42161',
  AVALANCHE: '43114',
  VOLTA: '73799',
  AURA_TESTNET: 'aura-testnet',
  AURA_SERENITY: 'serenity-testnet-001',
  AURA_HALO: 'halo-testnet-001',
  AURA_DEVNET: 'aura-devtnet',
  JUNO_TESTNET: 'uni-2',
  OSMOSIS_TESTNET: 'osmo-test-4',
  GAIA_TESTNET: 'theta-testnet-001',
  TERRA_TESTNET: 'bombay-12',
}

// Values match that required of onboard and returned by CGW
export enum WALLETS {
  METAMASK = 'metamask',
  WALLET_CONNECT = 'walletConnect',
  TREZOR = 'trezor',
  LEDGER = 'ledger',
  TRUST = 'trust',
  FORTMATIC = 'fortmatic',
  PORTIS = 'portis',
  AUTHEREUM = 'authereum',
  TORUS = 'torus',
  COINBASE = 'coinbase',
  WALLET_LINK = 'walletLink',
  OPERA = 'opera',
  OPERA_TOUCH = 'operaTouch',
  LATTICE = 'lattice',
  KEYSTONE = 'keystone',
  KEPLR = 'keplr',
  TERRA = 'terraStation'
}