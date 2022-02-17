export interface ITransactionInfoResponse {
    from: string,
    to: string,
    amount: number,
    fee: number,
    gasLimit: number,
    internalChainId: number
}

export interface ICreateSafeTransaction {
    from: string,
    to: string,
    amount: string,
    gasLimit: string,
    internalChainId: number,
    fee: number
}