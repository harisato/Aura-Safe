import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'

import { getExplorerInfo } from 'src/config'
import { ValidatorType } from 'src/logic/validator/store/reducer'
import { allValidator } from 'src/logic/validator/store/selectors'
import styled from 'styled-components'
import { useKnownAddress } from '../hooks/useKnownAddress'

type EthHashInfoRestProps = Omit<
  Parameters<typeof PrefixedEthHashInfo>[0],
  'hash' | 'name' | 'showAvatar' | 'customAvatar' | 'showCopyBtn' | 'explorerUrl'
>

type Props = EthHashInfoRestProps & {
  address: string
  name?: string | undefined
  avatarUrl?: string | undefined
}
const Wrapper = styled(PrefixedEthHashInfo)`
  > div:nth-child(2) {
    flex-direction: ${(props) => (props.showHash ? 'column' : 'row')};
  }
`
export const AddressInfo = ({ address, name, avatarUrl, ...rest }: Props): ReactElement | null => {
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
      name={addressDetail ? addressDetail.name : toInfo.name || undefined}
      showAvatar
      customAvatar={addressDetail?.picture || toInfo.logoUri || undefined}
      showCopyBtn={!addressDetail}
      explorerUrl={getExplorerInfo(addressDetail?.operatorAddress || address)}
      {...rest}
    />
  )
}
