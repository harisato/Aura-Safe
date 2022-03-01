import { ChainInfo } from "@keplr-wallet/types";

export const ChainsInfo: { [chainId: string]: ChainInfo } = {
  ["aura-testnet"]: {
    features: ['no-legacy-stdTx'],
    chainId: "aura-testnet",
    chainName: "aura testnet",
    rpc: "https://tendermint-testnet.aura.network",
    rest: "https://rpc-testnet.aura.network",
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "aura",
      bech32PrefixAccPub: "aura" + "pub",
      bech32PrefixValAddr: "aura" + "valoper",
      bech32PrefixValPub: "aura" + "valoperpub",
      bech32PrefixConsAddr: "aura" + "valcons",
      bech32PrefixConsPub: "aura" + "valconspub",
    },
    currencies: [
      {
        coinDenom: "AURA",
        coinMinimalDenom: "uaura",
        coinDecimals: 6,
        // coinGeckoId: "aura",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "AURA",
        coinMinimalDenom: "uaura",
        coinDecimals: 6,
        // coinGeckoId: "uaura",
      },
    ],
    stakeCurrency: {
      coinDenom: "AURA",
      coinMinimalDenom: "uaura",
      coinDecimals: 6,
      // coinGeckoId: "uaura",
    },
    coinType: 118,
    gasPriceStep: {
      low: 1,
      average: 2.5,
      high: 4
    },
    walletUrlForStaking: "https://aura.network"
  },
  ["aura-devnet"]: {
    features: ['no-legacy-stdTx'],
    chainId: "aura-devnet",
    chainName: "aura devnet",
    rpc: "http://34.199.79.132:26657",
    rest: "http://34.199.79.132:1317",
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "aura",
      bech32PrefixAccPub: "aura" + "pub",
      bech32PrefixValAddr: "aura" + "valoper",
      bech32PrefixValPub: "aura" + "valoperpub",
      bech32PrefixConsAddr: "aura" + "valcons",
      bech32PrefixConsPub: "aura" + "valconspub",
    },
    currencies: [
      {
        coinDenom: "AURA",
        coinMinimalDenom: "uaura",
        coinDecimals: 6,
        // coinGeckoId: "aura",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "AURA",
        coinMinimalDenom: "uaura",
        coinDecimals: 6,
        // coinGeckoId: "uaura",
      },
    ],
    stakeCurrency: {
      coinDenom: "AURA",
      coinMinimalDenom: "uaura",
      coinDecimals: 6,
      // coinGeckoId: "uaura",
    },
    coinType: 118,
    gasPriceStep: {
      low: 1,
      average: 2.5,
      high: 4
    },
    walletUrlForStaking: "https://aura.network"
  }
}