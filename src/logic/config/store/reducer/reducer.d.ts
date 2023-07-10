import { ChainId } from 'src/config/chain.d'

export type ConfigState = {
  chainId: ChainId
  environment: string
}

export type ConfigPayload = ChainId
