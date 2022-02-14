export interface ITransactionInfoResponse {
    from: string,
    to: string,
    amount: number,
    fee: number,
    gasLimit: number,
    internalChainId: number
}