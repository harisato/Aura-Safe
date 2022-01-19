import { fromByteArray } from "base64-js"


export function parseToAdress(arr: Uint8Array): string {
    return fromByteArray(arr)
}