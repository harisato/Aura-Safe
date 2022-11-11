import { Autocomplete, AutocompleteCloseReason } from '@material-ui/lab'
import { useSelector } from 'react-redux'
import { AddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { currentNetworkAddressBook } from 'src/logic/addressBook/store/selectors'
import MuiTextField from '@material-ui/core/TextField'
import { Wrapper } from './style'
import { useState, useEffect } from 'react'
import AddressInfo from 'src/components/AddressInfo'
import styled from 'styled-components'
import { colorLinear } from 'src/theme/variables'
import { extractSafeAddress } from 'src/routes/routes'

const StyledTextField = styled(MuiTextField)`
  width: 100%;
  label {
    z-index: 1;
    font-size: 14px;
    transform: translate(12px, 18px) scale(1);
  }
  .MuiInputLabel-shrink {
    transform: translate(12px, 8px) scale(0.85);
    height: 16px;
  }
  .MuiInputLabel-shrink.Mui-focused {
    color: #5ee6d0;
  }
  > div {
    background: #24262e;
    border: 1px solid #494c58;
    color: #fff;
    border-radius: 8px;
    padding: 0px !important ;
    &:hover {
      background: #24262e;
    }
  }
  > div.Mui-focused {
    background: linear-gradient(#24262e, #24262e) padding-box, ${colorLinear} border-box;
    border: 1px solid transparent;
    border-radius: 8px;
  }
  input {
    color: #fff;
    padding: 22px 12px 8px !important;
    font-size: 14px;
    height: 18px;
  }
  > div::after,
  > div::before {
    display: none;
  }
`

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
