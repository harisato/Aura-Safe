import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'

import { getExplorerInfo } from 'src/config'
import { ValidatorType } from 'src/logic/validator/store/reducer'
import { allValidator } from 'src/logic/validator/store/selectors'
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

export const AddressInfo = ({ address, name, avatarUrl, ...rest }: Props): ReactElement | null => {
  const toInfo = useKnownAddress({ value: address, name: name || null, logoUri: avatarUrl || null })
  const validatorsData = useSelector(allValidator)
  const addressDetail = validatorsData.find((validator: ValidatorType) => validator.operatorAddress == address)

  if (address === '') {
    return null
  }
  console.log(address, addressDetail)
  return (
    <PrefixedEthHashInfo
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
