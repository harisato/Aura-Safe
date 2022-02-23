import { TransactionListItem, TransactionSummary } from "@gnosis.pm/safe-react-gateway-sdk";

export type MTransactionListItem = TransactionListItem & {
    transaction: TransactionSummary & { txHash?: string }
}
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

export interface ISignature {
    id: number;
    createdAt: string;
    updatedAt: string;
    ownerAddress: string;
}

export interface ITransactionDetail {
    CreatedAt: string;
    UpdatedAt: string;
    Id: number;
    Code: string;
    CodeSpace?: any;
    Data: string;
    GasUsed: number;
    GasWanted: number;
    Height: number;
    Info: string;
    Logs: string;
    RawLogs: string;
    FromAddress: string;
    ToAddress: string;
    Amount: number;
    Denom: string;
    TimeStamp?: any;
    Tx: string;
    TxHash: string;
    InternalChainId: number;
    ChainId: string;
    Status: string;
    Direction: string;
    Signatures: Signatures;
}