export const FIELD_CREATE_CUSTOM_SAFE_NAME = 'customSafeName'
export const FIELD_CREATE_SUGGESTED_SAFE_NAME = 'suggestedSafeName'
export const FIELD_SAFE_OWNERS_LIST = 'owners'
export const FIELD_SAFE_THRESHOLD = 'safeThreshold'
export const FIELD_SAFE_CREATED_ADDRESS = 'safeCreatedAddress'

export const FIELD_ALLOW_SAFE_ADDRESS = 'customSafeAdress'

export type OwnerFieldItem = {
  name: string
  address: string
}

export type CancelSafeFormValues = {
  [FIELD_CREATE_SUGGESTED_SAFE_NAME]: string
  [FIELD_CREATE_CUSTOM_SAFE_NAME]?: string
  [FIELD_SAFE_OWNERS_LIST]: Array<OwnerFieldItem>
  [FIELD_SAFE_THRESHOLD]: number
  [FIELD_SAFE_CREATED_ADDRESS]?: string

  [FIELD_ALLOW_SAFE_ADDRESS]: string
}
