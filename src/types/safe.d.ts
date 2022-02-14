
export type Safe = {
    id: number
    safeAddress: string
    creatorAddress: string
    status: string
    ownerAddress: string
}

export type OwnedMSafes = Safe[]

export interface IMSafeInfo {
    id: number;
    address: string;
    pubkeys: string;
    owners: (string)[];
    confirms: (string)[];
    threshold: number;
    status: string;
    internalChainId: number;
    balance: {
        denom: string;
        amount: string;
    }[]
}

export interface IMSafeResponse {
    creatorAddress: string;
    creatorPubkey: string;
    threshold: number;
    status: string;
    internalChainId: number;
    addressHash: string;
    safeAddress?: any;
    safePubkey?: any;
    createdAt: Date;
    updatedAt: Date;
    id: number;
}