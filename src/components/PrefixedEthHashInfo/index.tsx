import { ReactElement } from 'react'
import { getChainInfo } from 'src/config'
import { parsePrefixedAddress } from 'src/utils/prefixedAddress'
import { StyledPrefixedEthHashInfo } from './styles'

type Props = Omit<Parameters<typeof StyledPrefixedEthHashInfo>[0], 'shouldShowShortName' | 'shouldCopyShortName'>

const PrefixedEthHashInfo = ({ hash, ...rest }: any): ReactElement => {
  // const showChainPrefix = useSelector(showShortNameSelector)
  // const copyChainPrefix = useSelector(copyShortNameSelector)

  const showChainPrefix = false
  const copyChainPrefix = false

  const { address } = parsePrefixedAddress(hash)
  const chainInfo = getChainInfo()

  if (!chainInfo) {
    return <></>
  }

  return (
    <StyledPrefixedEthHashInfo
      hash={address}
      className="ethInfo"
      shortName={chainInfo.shortName}
      shouldShowShortName={showChainPrefix}
      shouldCopyShortName={copyChainPrefix}
      {...rest}
    />
  )
}

export default PrefixedEthHashInfo
