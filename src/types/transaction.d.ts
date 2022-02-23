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
    SafeId: number;
    FromAddress: string;
    ToAddress: string;
    Signature: string;
    InternalChainId: number;
    Gas: number;
    Fee: number;
    MultisigPubkey: string;
    TxHash?: any;
    Map: string;
    Amount: number;
    Denom: string;
    Status: string;
    TypeUrl: string;
    Sequence: string;
    Msg: string;
    AccountNumber: string;
    ChainId: string;
    Signatures: Signature[];
}