export const FIELD_ALLOW_CUSTOM_SAFE_NAME = 'customSafeName'
export const FIELD_ALLOW_SUGGESTED_SAFE_NAME = 'suggestedSafeName'
export const FIELD_SAFE_OWNER_LIST = 'safeOwnerList'
export const FIELD_SAFE_OWNERS_LIST = 'owners'
export const FIELD_ALLOW_SAFE_ID = 'safeId'
export const FIELD_ALLOW_IS_LOADING_SAFE_ADDRESS = 'isLoadingSafeAddress'
export const FIELD_SAFE_THRESHOLD = 'safeThreshold'

export type OwnerFieldListItem = {
  address: string
  name: string
}

export type AllowSafeFormValues = {
  [FIELD_ALLOW_CUSTOM_SAFE_NAME]: string
  [FIELD_ALLOW_SUGGESTED_SAFE_NAME]: string
  [FIELD_ALLOW_SAFE_ID]: number
  [FIELD_ALLOW_IS_LOADING_SAFE_ADDRESS]: boolean
  [FIELD_SAFE_OWNER_LIST]: Array<OwnerFieldListItem>
  [FIELD_SAFE_THRESHOLD]: number
}
