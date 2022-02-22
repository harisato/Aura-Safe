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

export interface ITransactionListQuery {
    safeAddress: string,
    pageSize: number,
    pageIndex: number
}

export interface ITransactionListItem {
    Id: number,
    CreatedAt: string,
    UpdatedAt: string,
    FromAddress: string,
    ToAddress: string,
    TxHash: string,
    Amount: number,
    Denom: string,
    Status: string,
    Signatures: string[],
    Direction: string
} 
