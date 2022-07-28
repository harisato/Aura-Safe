import { AddressBookMap } from 'src/logic/addressBook/store/selectors'
import { FIELD_ALLOW_CUSTOM_SAFE_NAME, FIELD_ALLOW_SUGGESTED_SAFE_NAME, LoadSafeFormValues } from './allowFields'

export function getLoadSafeName(formValues: LoadSafeFormValues, addressBook: AddressBookMap): string {
  return formValues[FIELD_ALLOW_CUSTOM_SAFE_NAME] || formValues[FIELD_ALLOW_SUGGESTED_SAFE_NAME]
}
