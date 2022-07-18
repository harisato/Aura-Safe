import { AddressBookMap } from 'src/logic/addressBook/store/selectors'
import { CancelSafeFormValues } from 'src/routes/CancelSafePage/fields/cancelSafeFields'
import { checksumAddress } from 'src/utils/checksumAddress'
// import {
//   FIELD_ALLOW_CUSTOM_SAFE_NAME,
//   FIELD_ALLOW_SAFE_ADDRESS,
//   FIELD_ALLOW_SUGGESTED_SAFE_NAME,
//   LoadSafeFormValues,
// } from './loadFields'

import {
  FIELD_ALLOW_SAFE_ADDRESS,
  FIELD_CREATE_CUSTOM_SAFE_NAME,
  FIELD_CREATE_SUGGESTED_SAFE_NAME,
} from './cancelSafeFields'

export function getLoadSafeName(formValues: CancelSafeFormValues, addressBook: AddressBookMap): string {
  let safeAddress = formValues[FIELD_ALLOW_SAFE_ADDRESS] || ''
  safeAddress = safeAddress && checksumAddress(safeAddress)

  return (
    formValues[FIELD_CREATE_CUSTOM_SAFE_NAME] ||
    addressBook[safeAddress]?.name ||
    formValues[FIELD_CREATE_SUGGESTED_SAFE_NAME]
  )
}
