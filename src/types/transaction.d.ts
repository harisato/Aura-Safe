export interface ITransactionInfoResponse {
  from: string
  to: string
  amount: number
  fee: number
  gasLimit: number
  internalChainId: number,
  transactionId: number,
  id: number
}

export interface ICreateSafeTransaction {
  from: string
  to: string
  amount: string
  gasLimit: string
  internalChainId: number
  fee: number
  creatorAddress: string
  signature: string
  bodyBytes: string
}

export interface ISignSafeTransaction {
  fromAddress: string
  transactionId: number
  bodyBytes: string
  signature: string
  internalChainId: number
}
