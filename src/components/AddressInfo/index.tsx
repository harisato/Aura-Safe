import { ReactElement } from 'react'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { useSelector } from 'react-redux'

import { AddressEx } from '@gnosis.pm/safe-react-gateway-sdk'
import { ADDRESS_BOOK_DEFAULT_NAME } from 'src/logic/addressBook/model/addressBook'
import { addressBookEntryName } from 'src/logic/addressBook/store/selectors'
import { sameString } from 'src/utils/strings'
import { getExplorerInfo } from 'src/config'
import { ValidatorType } from 'src/logic/validator/store/reducer'
import { allValidator } from 'src/logic/validator/store/selectors'
import styled from 'styled-components'

type EthHashInfoRestProps = Omit<
  Parameters<typeof PrefixedEthHashInfo>[0],
  'hash' | 'name' | 'showAvatar' | 'customAvatar' | 'showCopyBtn' | 'explorerUrl'
>

type Props = EthHashInfoRestProps & {
  address: string
  type?: string
  name?: string | undefined
  avatarUrl?: string | undefined
}
const Wrapper = styled(PrefixedEthHashInfo)`
  > div:nth-child(2) {
    flex-direction: ${(props) => (props.showHash ? 'column' : 'row')};
  }
`
export default function AddressInfo({
  address,
  name,
  showAvatar = true,
  showName = true,
  avatarUrl,
  type,
  ...rest
}: Props): ReactElement | null {
  const toInfo = useKnownAddress({ value: address, name: name || null, logoUri: avatarUrl || null })
  const validatorsData = useSelector(allValidator)
  const addressDetail = validatorsData.find((validator: ValidatorType) => validator.operatorAddress == address)

  if (!address) {
    return null
  }
  return (
    <Wrapper
      hash={address}
      showHash={!addressDetail}
      name={showName ? (addressDetail ? addressDetail.name : toInfo.name || undefined) : undefined}
      showAvatar={showAvatar}
      customAvatar={addressDetail?.picture || toInfo.logoUri || undefined}
      showCopyBtn={!addressDetail}
      explorerUrl={getExplorerInfo(addressDetail?.operatorAddress || address, type)}
      {...rest}
    />
  )
}

const DEFAULT_PROPS: AddressEx = {
  value: '',
  name: null,
  logoUri: null,
}
const useKnownAddress = (props: AddressEx | null = DEFAULT_PROPS): AddressEx & { isInAddressBook: boolean } => {
  const recipientName = useSelector((state) => addressBookEntryName(state, { address: props?.value || '' }))

  // Undefined known address
  if (!props) {
    return {
      ...DEFAULT_PROPS,
      isInAddressBook: false,
    }
  }

  // We have to check that the name returned is not UNKNOWN
  const isInAddressBook = !sameString(recipientName, ADDRESS_BOOK_DEFAULT_NAME)
  const name = isInAddressBook && recipientName ? recipientName : props?.name

  return {
    ...props,
    name,
    isInAddressBook,
  }
}
