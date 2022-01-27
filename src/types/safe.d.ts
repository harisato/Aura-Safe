
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
/* 
{
  "ErrorCode": "SUCCESSFUL",
  "Message": "Successfully!",
  "Data": {
    "creatorAddress": "aura1xahhax60fakwfng0sdd6wcxd0eeu00r5w3s49h",
    "creatorPubkey": "A78uo5vGMPnmtn37pyufax0Mp0jUxIOKckqv4rp/Gz12",
    "threshold": 1,
    "status": "pending",
    "internalChainId": 4,
    "addressHash": "0QqmsluoqI8ixDz0T1I/8QMC3Tp2vFrT+44/yKdRwRg=",
    "safeAddress": null,
    "safePubkey": null,
    "createdAt": "2022-01-27T04:09:36.523Z",
    "updatedAt": "2022-01-27T04:09:36.523Z",
    "id": 57
  },
  "AdditionalData": []
}
 */