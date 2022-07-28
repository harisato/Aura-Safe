import { AddressBookMap } from 'src/logic/addressBook/store/selectors'
import { AllowSafeFormValues, FIELD_ALLOW_CUSTOM_SAFE_NAME, FIELD_ALLOW_SUGGESTED_SAFE_NAME } from './allowFields'

export function getLoadSafeName(formValues: AllowSafeFormValues, addressBook: AddressBookMap): string {
  return formValues[FIELD_ALLOW_CUSTOM_SAFE_NAME] || formValues[FIELD_ALLOW_SUGGESTED_SAFE_NAME]
}
