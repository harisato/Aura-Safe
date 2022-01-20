export enum SafeStatus {
    Pending = 'pending',
    Created = 'created',
    Failed = 'failed'
}


export type Safe = {
    id: number
    safeAddress: string
    creatorAddress: string
    status: string
    ownerAddress: string
}

export type OwnedMSafes = Safe[]
