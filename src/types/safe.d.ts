
export type Safe = {
    id: number
    safeAddress: string
    creatorAddress: string
    status: string
    ownerAddress: string
}

export type OwnedMSafes = Safe[]

export interface IMSafeInfo {
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
    }
}