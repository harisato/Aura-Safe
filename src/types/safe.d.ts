export enum SafeStatus {
    Created = 'created',
    Pending = 'pending',
    NeedConfirm = 'needConfirm',
    Confirmed = 'confirmed',
    Deleted = 'deleted'
}


export type Safe = {
    id: number
    safeAddress: string
    creatorAddress: string
    status: string
    ownerAddress: string
}

export type OwnedMSafes = Safe[]
