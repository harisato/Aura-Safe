import { Autocomplete, AutocompleteCloseReason } from '@material-ui/lab'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import AddressInfo from 'src/components/AddressInfo'
import { AddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { currentNetworkAddressBook } from 'src/logic/addressBook/store/selectors'
import { extractSafeAddress } from 'src/routes/routes'
import { StyledTextField } from '../StyledTextField'

export default function AddressInput({
  label = 'Address',
  value,
  onChange,
  onClose,
  onFocus,
  autoFocus,
}: {
  label?: string
  value?: AddressBookEntry
  onChange?: (recipient: AddressBookEntry) => void
  onClose?: (input: string | undefined, event: any, reason: AutocompleteCloseReason) => void
  onFocus?: any
  autoFocus?: boolean
}) {
  const currentSafe = extractSafeAddress()
  const addressBook = useSelector(currentNetworkAddressBook).filter((add) => add.address != currentSafe)
  const [input, setInput] = useState<string | undefined>(value?.address)
  return (
    <Autocomplete<AddressBookEntry, false, false, true>
      closeIcon={null}
      onChange={(e, recipient: AddressBookEntry) => {
        onChange && onChange(recipient)
        setInput(recipient.address)
      }}
      options={addressBook}
      freeSolo
      openOnFocus
      value={value}
      onClose={(event, reason) => onClose && onClose(input?.trim(), event, reason)}
      onFocus={onFocus}
      renderInput={(params) => {
        return (
          <StyledTextField
            value={input}
            {...params}
            autoFocus={autoFocus}
            label={label}
            onChange={(event) => setInput(event.target.value)}
          />
        )
      }}
      getOptionLabel={({ address }) => address}
      renderOption={({ address, name }) => <AddressInfo address={address} name={name} showAvatar />}
      role="listbox"
    />
  )
}
