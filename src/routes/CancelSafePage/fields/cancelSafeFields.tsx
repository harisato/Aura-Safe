export const FIELD_CREATE_CUSTOM_SAFE_NAME = 'customSafeName'
export const FIELD_CREATE_SUGGESTED_SAFE_NAME = 'suggestedSafeName'
export const FIELD_SAFE_OWNERS_LIST = 'owners'
export const FIELD_SAFE_THRESHOLD = 'safeThreshold'

export type OwnerFieldItem = {
  name: string
  address: string
}

export type CancelSafeFormValues = {
  [FIELD_CREATE_SUGGESTED_SAFE_NAME]: string
  [FIELD_CREATE_CUSTOM_SAFE_NAME]?: string
  [FIELD_SAFE_OWNERS_LIST]: Array<OwnerFieldItem>
  [FIELD_SAFE_THRESHOLD]: number
}

export const SAFE_PENDING_CREATION_STORAGE_KEY = 'NEW_SAFE_PENDING_CREATION_STORAGE_KEY'
