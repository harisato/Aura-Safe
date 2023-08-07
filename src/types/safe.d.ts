export type Safe = {
  id: number
  safeAddress: string
  creatorAddress: string
  status: string
  ownerAddress: string
}

export type OwnedMSafes = Safe[]

export interface IMSafeInfo {
  accountNumber: string
  id: number
  address: string
  pubkeys: string
  owners: string[]
  confirms: string[]
  threshold: number
  status: string
  internalChainId: number
  createdAddress?: string
  balance: {
    denom: string
    amount: string
  }[]
  txQueuedTag: string
  txHistoryTag: string
  nextQueueSeq: string
  sequence: string
  assets: {
    CW20: any
    CW721: any
  }
  coinConfig: any[]
}

export interface IMSafeResponse {
  creatorAddress: string
  creatorPubkey: string
  threshold: number
  status: string
  internalChainId: number
  addressHash: string
  safeAddress?: any
  safePubkey?: any
  createdAt: Date
  updatedAt: Date
  id: number
}
